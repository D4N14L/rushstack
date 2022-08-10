/** @public */
export declare abstract class AbstractClass {
    abstract member(): void;
}

/** @public */
export declare class ClassWithTypeLiterals {
    /** type literal in  */
    method1(vector: {
        x: number;
        y: number;
    }): void;
    /** type literal output  */
    method2(): {
        classValue: ClassWithTypeLiterals;
        callback: () => number;
    } | undefined;
}

/** @public */
export declare class ClassWithTypeParameter<T> {
}

/** @public */
export declare const CONST_VARIABLE: string;

/** @public */
export declare const enum ConstEnum {
    Zero = 0,
    One = 1,
    Two = 2
}

/** @public */
export declare class ExtendsClassWithTypeParameter extends ClassWithTypeParameter<SimpleClass> {
}

/** @public */
export declare interface IInterface {
    member: string;
}

/** @public */
export declare namespace NamespaceContainingVariable {
    let variable: object[];
    let constVariable: object[];
}

/** @public */
export declare let nonConstVariable: string;

/** @public */
export declare enum RegularEnum {
    /**
     * These are some docs for Zero
     */
    Zero = 0,
    /**
     * These are some docs for One
     */
    One = 1,
    /**
     * These are some docs for Two
     */
    Two = 2
}

/** @public */
export declare class SimpleClass {
    member(): void;
    optionalParamMethod(x?: number): void;
    get readonlyProperty(): string;
    get writeableProperty(): string;
    set writeableProperty(value: string);
    readonly someReadonlyProp = 5;
    readonly someReadonlyPropWithType: number;
}

/** @public */
export declare const VARIABLE_WITHOUT_EXPLICIT_TYPE = "hello";

export { }
