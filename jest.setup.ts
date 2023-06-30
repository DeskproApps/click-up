import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
//@ts-ignore
global.TextDecoder = TextDecoder;
