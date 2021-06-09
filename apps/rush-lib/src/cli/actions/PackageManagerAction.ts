// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as os from 'os';
import * as path from 'path';
import colors from 'colors/safe';
import { ConsoleTerminalProvider, FileSystem, Terminal } from '@rushstack/node-core-library';
import { CommandLineFlagParameter, CommandLineRemainder } from '@rushstack/ts-command-line';

import { RushCommandLineParser } from '../RushCommandLineParser';
import { BaseRushAction } from './BaseRushAction';
import { PackageManagerName } from '../../api/packageManager/PackageManager';
import { InstallHelpers } from '../../logic/installManager/InstallHelpers';
import { LastInstallFlag, LastInstallFlagFactory } from '../../api/LastInstallFlag';
import { Utilities } from '../../utilities/Utilities';

export class PackageManagerAction extends BaseRushAction {
  private _terminalProvider!: ConsoleTerminalProvider;
  private _terminal!: Terminal;
  private _list!: CommandLineFlagParameter;
  private _unsafe!: CommandLineFlagParameter;
  private _commandToRun!: CommandLineRemainder;

  private _supportedCommands: Map<PackageManagerName, Set<string>> = new Map([
    ['pnpm', new Set<string>(['audit', 'list', 'outdated', 'why'])]
  ]);

  public constructor(parser: RushCommandLineParser) {
    super({
      actionName: 'pm',
      summary: 'Run a command supported by the selected package manager',
      documentation: 'Insert doc here',
      parser
    });

    this._terminalProvider = new ConsoleTerminalProvider();
    this._terminal = new Terminal(this._terminalProvider);
  }

  protected onDefineParameters(): void {
    this._list = this.defineFlagParameter({
      parameterLongName: '--list',
      parameterShortName: '-l',
      description: 'List the supported commands that can be passed to the package manager'
    });

    this._unsafe = this.defineFlagParameter({
      parameterLongName: '--unsafe',
      description:
        '(UNSAFE!) Run the command against the package manager without validation performed by Rush.' +
        ' Rush uses an allow list approach to executing commands on the package manager in order to' +
        ' ensure the integrity of your install is not negatively affected. If this flag is provided,' +
        ' the command will be run on the package manager regardless of the allow list. Rush will also' +
        ' invalidate the current install, which will block running certain Rush commands until' +
        ' `rush install` or `rush update` completes.'
    });

    this._commandToRun = this.defineCommandLineRemainder({
      description:
        'The command to be passed to the package manager. To print a list of allowed' +
        ' commands, use the "--list" parameter'
    });
  }

  protected async runAsync(): Promise<void> {
    // If the --list parameter was passed, print out the list of supported commands for the current
    // package manager and exit early
    if (this._list.value) {
      this._printSupportedList();
      return;
    }

    const commandArgs: string[] = [...this._commandToRun.values];

    // First, let's make sure the command they passed does not start with the package manager name
    // and remove if it does
    if (commandArgs.length && commandArgs[0] === this.rushConfiguration.packageManager) {
      commandArgs.shift();
    }

    // Then let's ensure that the provided command is supported
    this._validateArgs(commandArgs);

    // Then we can run the command
    const packageManagerEnv: NodeJS.ProcessEnv = InstallHelpers.getPackageManagerEnvironment(
      this.rushConfiguration
    );
    // Manually set the workspace path
    packageManagerEnv['NPM_CONFIG_LOCKFILE_DIR'] = this.rushConfiguration.commonTempFolder;
    packageManagerEnv['NPM_CONFIG_WORKSPACE_DIR'] = this.rushConfiguration.commonTempFolder;

    const packageManagerFilename: string = this.rushConfiguration.packageManagerToolFilename;
    this._terminal.writeLine(
      colors.green('Invoking package manager: ') +
        FileSystem.getRealPath(packageManagerFilename) +
        ' ' +
        commandArgs.join(' ') +
        os.EOL
    );

    Utilities.executeCommand({
      command: packageManagerFilename,
      args: commandArgs,
      workingDirectory: process.cwd(),
      environment: packageManagerEnv,
      suppressOutput: false
    });
  }

  private _validateArgs(args: string[]): void {
    // Then let's validate that we support the action that they've provided
    const lastInstallFlag: LastInstallFlag = LastInstallFlagFactory.getCommonTempFlag(this.rushConfiguration);
    if (this._unsafe.value) {
      // Passing --unsafe will cause us to bypass all validation, but as a safety measure we will clear
      // the last-install.flag file
      this._terminal.writeWarningLine(
        'Bypassing command validation and invalidating install since the "--unsafe" flag was provided.'
      );
      lastInstallFlag.clear();
    } else if (
      args.length &&
      !this._supportedCommands.get(this.rushConfiguration.packageManager)?.has(args[0])
    ) {
      throw new Error(
        `The provided package manager action "${args[0]}" is not supported by Rush. To view a list` +
          ' of supported commands, run "rush pm --list".'
      );
    } else {
      // Validate that there is an existing install to work from. Many package manager features will require
      // the setup that Rush performs during Rush install as a prerequisite to running any commands.
      const lastInstallFlag: LastInstallFlag = LastInstallFlagFactory.getCommonTempFlag(
        this.rushConfiguration
      );
      if (!lastInstallFlag.checkValidAndReportStoreIssues()) {
        throw new Error(`Install flag invalid.${os.EOL}Did you run "rush install" or "rush update"?`);
      }
    }
  }

  private _printSupportedList(): void {
    const allSupportedActions: Set<string> | undefined = this._supportedCommands.get(
      this.rushConfiguration.packageManager
    );
    if (allSupportedActions?.size) {
      allSupportedActions.forEach((action) => this._terminal.writeLine(action));
    } else {
      this._terminal.writeLine(
        `No commands are currently supported for package manager "${this.rushConfiguration.packageManager}".`
      );
    }
  }
}
