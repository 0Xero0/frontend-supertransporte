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
export class InputMonedaComponent implements OnInit, ControlValueAccessor {
  @Input('cantidadDecimales') cantidadDecimales: number = 3
  @Input('valorInicial') valorInicial: number = 0;
  valor: number = 0;
  valorInput: string = ""
  valorAnterior: string = ""
  deshabilitado: boolean = false
  regex: RegExp

  constructor() {
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]{1,${3}})?$`)
  }

  ngOnInit(): void {
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]{1,${this.cantidadDecimales}})?$`)
    this.valorInput = this.formatear(this.valorInicial.toString()) 
    this.valorAnterior = this.valorInicial.toString()
  }

  formatear(valor: string) {
    return valor.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  desformatear(valor: string) {
    return valor.replace(/,/g, "")
  }

  alCambiarValor(valor: string) {
    valor = this.desformatear(valor)
    if (!this.regex.test(valor) && valor !== "") {
      this.valorInput = this.valorAnterior
      return;
    }
    this.valorInput = this.formatear(valor.toString()) 
    this.valorAnterior = this.valorInput
    this.valor = Number(this.desformatear(this.valorInput))
    this.onChange(this.valor)
  }

  //NgValueAccesor Interface
  onChange = (valor: number) => { }

  onTouched = () => { }

  writeValue(valor: number): void {
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
