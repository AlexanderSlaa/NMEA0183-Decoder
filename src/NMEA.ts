import "reflect-metadata";

export namespace NMEA{

    export namespace Utils{
        export type ClassConstructor<T> = { new(val?: any): T};


        export function isClass(val: any){
            if(val === undefined){
                return false;
            }
            return val?.prototype?.constructor
        }

        export function getArgs(fn: Function){
            return fn.toString()
                .match(/\((?:.+(?=\s*\))|)/)[0]
                .slice(1).split(/\s*,\s*/g);
        }


        export function isMessageFieldClassDescriptor(val: any){
            if(val == undefined){
                return false;
            }
            return val?.DESCRIPTOR !== undefined;
        }
        export function isMessageFieldDescriptor(val: any){
            return !isClass(val) && val?.DESCRIPTOR === undefined
        }

        export function getFieldCount(val: any){
            if(val == undefined){
                return 0;
            }
            if(isMessageFieldClassDescriptor(val)){
                return getFieldCount(val?.DESCRIPTOR);
            }else if(isMessageFieldDescriptor(val)){
                return Object.keys(val).length;
            }else{
                return 1;
            }
        }

        export class Out<T> {
            private readonly getter: () => T;
            private readonly setter: (val: T) => void;

            constructor(getter?: () => T, setter?: (val: T) => void) {
                this.getter = getter;
                this.setter = setter;
            }

            set _(val :T){
                if(this.setter){
                    this.setter(val);
                }
            }

            get _(): T{
                if(this.getter){
                    return this.getter()
                }
                return undefined;
            }

        }
    }

    export namespace Types{

        export interface ClassConstructor<T> extends Utils.ClassConstructor<T>{
            DESCRIPTOR?:NMEA.Types.MessageFieldDescriptor<T>
        }

        export enum Packets{
            NMEA_0183 = "$",
            AIVDM = "!"
        }


        export type InlineDecoder = (msg: string[], indexAccessor: Out<number>) => any;

        export type MessageFieldDescriptor<T> = {[name: string]: string | ClassConstructor<T> | InlineDecoder | MessageFieldDescriptor<any>};

        export interface MessageDescription<T>{
            prefix: string,
            explanation?: string;
            schema?: MessageFieldDescriptor<T>
        }

        export interface Schema{
            packet: Packets;
            prefix: string;
            explanation?: string;
            descriptions: MessageDescription<any>[]
        }

        export class MetricValue {

            public static readonly DESCRIPTOR = <MessageFieldDescriptor<any>>{
                val: Number,
                unit: String
            }

            val: number;
            unit: string;

        }

    }

    export namespace Decorators{

        function EnsureDescriptor(target: any): any{
            if(!target?.DESCRIPTOR){
                target.DESCRIPTOR = {}
            }
            return target.DESCRIPTOR;
        }

        export function Descriptor(type: any){
            return function (target: any, propertyKey: string, propertyDescriptor?: any){
                EnsureDescriptor(target.constructor)[propertyKey] = type;
            }

        }

    }

    import ClassConstructor = NMEA.Utils.ClassConstructor;
    import getFieldCount = NMEA.Utils.getFieldCount;
    import isClass = NMEA.Utils.isClass;
    import Out = NMEA.Utils.Out;
    import Schema = NMEA.Types.Schema;
    import MessageFieldDescriptor = NMEA.Types.MessageFieldDescriptor;





    export class Decoder{

        public static schemas = new Map<string, Schema>();

        static register(...schemas: Schema[]){
            schemas.forEach(schema =>{
                Decoder.schemas.set(schema.packet + schema.prefix,schema);
            })
        }

        static struct<T>(props: string[], DESCRIPTOR: MessageFieldDescriptor<T> | NMEA.Types.ClassConstructor<T>, thisArg: T = <T>{}) {
            if(DESCRIPTOR?.DESCRIPTOR){
                thisArg = new (<ClassConstructor<T>><unknown>DESCRIPTOR)();
                DESCRIPTOR = <MessageFieldDescriptor<T>>DESCRIPTOR.DESCRIPTOR;
            }

            let index = 0;
            for (let descriptorKey in DESCRIPTOR) {
                let fieldCount = getFieldCount(DESCRIPTOR[descriptorKey]);
                let newIndex = index + fieldCount;
                if(fieldCount > 1){
                    thisArg[descriptorKey] = this.struct(props.slice(index, newIndex), DESCRIPTOR[descriptorKey])
                }else if(isClass(DESCRIPTOR[descriptorKey])){
                    thisArg[descriptorKey] = new DESCRIPTOR[descriptorKey](props.slice(index, newIndex));
                }else if(typeof DESCRIPTOR[descriptorKey] === "function"){
                    thisArg[descriptorKey] = DESCRIPTOR[descriptorKey](props.slice(index), new Out<number>(() => newIndex, val => newIndex = val))
                }else {
                    thisArg[descriptorKey] = props[newIndex++];
                }
                index = newIndex;
            }
            return thisArg;
        }

        static schema(nmea: string| string[]): Schema{
            let data;
            if(Array.isArray(nmea)){
                data = nmea;
            }else{
                if(!nmea.includes(",")){
                    throw new Error("nmea message doesn't include default separator ','")
                }
                data = nmea.split(",");
            }
            let schemaIdentifier = data[0].substring(0,3);
            if(!this.schemas.has(schemaIdentifier)){
                throw new Error(`unknown NMEA Talker ID '${schemaIdentifier}' on message "${nmea}"`);
            }
            return this.schemas.get(schemaIdentifier);
        }

        static type(nmea: string| string[], schema?: Schema): any {
            let data;
            if(Array.isArray(nmea)){
                data = nmea;
            }else{
                if(!nmea.includes(",")){
                    throw new Error("nmea message doesn't include default separator ','")
                }
                data = nmea.split(",");
            }
            if(schema === undefined){
                schema = NMEA.Decoder.schema(data);
            }
            let schemaDataTypeIdentifier = data[0].substring(3,6);
            let dataTypeSchema = undefined;
            for (let description of schema.descriptions) {
                if(description.prefix == schemaDataTypeIdentifier){
                    dataTypeSchema = description.schema;
                }
            }
            if(dataTypeSchema === undefined){
                throw new Error(`unknown NMEA data type '${schemaDataTypeIdentifier}' on message "${nmea}"`);
            }
            for (let description of schema.descriptions) {
                if(description.prefix == schemaDataTypeIdentifier){
                    dataTypeSchema = description.schema;
                }
            }
            return dataTypeSchema;
        }

        static decode<T>(nmeaString: string): T {
            if(!nmeaString.includes(",")){
                throw new Error("nmea message doesn't include default separator ','")
            }
            let data = nmeaString.split(",");
            if(!data[data.length-1].startsWith("*")){
                let old = data[data.length-1];
                let newData = old.split("*");
                data[data.length-1] = newData[0]
                data.push("*" + newData[1]);
            }
            let schema = NMEA.Decoder.schema(data);
            let dataTypeSchema = NMEA.Decoder.type(data, schema);
            return this.struct(data.slice(1), dataTypeSchema);
        }
    }



}