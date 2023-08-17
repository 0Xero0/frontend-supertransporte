import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-moneda',
  templateUrl: './input-moneda.component.html',
  styleUrls: ['./input-moneda.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMonedaComponent),
      multi: true
    }
  ]
})
export class InputMonedaComponent implements OnInit, ControlValueAccessor{
  @Input('cantidadDecimales') cantidadDecimales: number = 3
  @Input('valorInicial') valorInicial: string = "";
  valor: string = ""
  valorAnterior: string = ""
  deshabilitado: boolean = false
  regex: RegExp

  constructor(){
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]{1,${3}})?$`)
  }

  ngOnInit(): void {
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]{1,${this.cantidadDecimales}})?$`)
    this.valorAnterior = this.valorInicial
  }

  alCambiarValor(valor: string){
    console.log('ejecutando al cambiar')
    if(!this.regex.test(valor) && valor !== ""){
      this.valor = this.valorAnterior
    }
    this.valorAnterior = this.valor
    this.onChange(this.valor)
  }

  //NgValueAccesor Interface
  onChange = (valor: string)=>{}

  onTouched = ()=>{}

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
