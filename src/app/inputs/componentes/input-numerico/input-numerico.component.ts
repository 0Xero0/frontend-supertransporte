import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-numerico',
  templateUrl: './input-numerico.component.html',
  styleUrls: ['./input-numerico.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumericoComponent),
      multi: true
    }
  ]
})
export class InputNumericoComponent implements OnInit, ControlValueAccessor {
  @Input('cantidadDecimales') cantidadDecimales: number = 3
  @Input('valorInicial') valorInicial: string = "";
  valor: string = ""
  valorAnterior: string = ""
  deshabilitado: boolean = false
  regex: RegExp

  constructor() {
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]{1,${3}})?$`)
  }

  ngOnInit(): void {
    if(this.cantidadDecimales > 0){
      this.regex = new RegExp(`^[0-9]+(\\.[0-9]{1,${this.cantidadDecimales}})?$`)
    }else{
      this.regex = new RegExp(`^[0-9]+$`)
    }
    this.valorAnterior = this.valorInicial
  }

  alCambiarValor(valor: string) {
    console.log('ejecutando al cambiar')
    if (!this.regex.test(valor) && valor !== "") {
      this.valor = this.valorAnterior
    }
    this.valorAnterior = this.valor
    this.onChange(this.valor)
  }

  //NgValueAccesor Interface
  onChange = (valor: string) => { }

  onTouched = () => { }

  writeValue(valor: string): void {
    this.valor = valor
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.deshabilitado = isDisabled
  }
}
