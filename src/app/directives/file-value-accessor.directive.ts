import { Directive, ElementRef } from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

@Directive({
    selector: "input[type=file]",
    host : {
        "(change)" : "onChange($event.target.files)",
        "(blur)": "onTouched()"
    },
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true }
    ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {
    value: any;

    onTouched = () => {};
    onChange = (_) => {};

    constructor(private hostElement: ElementRef) {}
    writeValue(value) { if (!value) this.hostElement.nativeElement.value = ''; }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
}