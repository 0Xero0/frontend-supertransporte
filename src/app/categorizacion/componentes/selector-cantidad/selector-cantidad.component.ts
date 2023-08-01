import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selector-cantidad',
  templateUrl: './selector-cantidad.component.html',
  styleUrls: ['./selector-cantidad.component.css']
})
export class SelectorCantidadComponent implements OnInit, AfterViewInit {
  @Output('valor') nuevoValor: EventEmitter<number>
  @Output('valorEspecial') nuevoValorEspecial: EventEmitter<{ valor: number, fila: number }>
  @Input('totalizable') totalizable!: boolean
  @Input('estado') estado!: boolean
  @Input('fila') fila!: number
  @Input('columna') columna!: number
  @Input('idFila') idFila!: number
  @Input('idColumna') idColumna!: number
  @Input('valor') valor: number | null =  SelectorCantidadComponent.VALOR_POR_DEFECTO
  habilitado: boolean = true
  invalido: boolean = false 
  clases = {}


  static readonly VALOR_POR_DEFECTO = 0
  static readonly VALOR_MINIMO = 0
  static readonly VALOR_MINIMO_NO_TOTALIZABLE = 1

  constructor(){
    this.nuevoValor = new EventEmitter<number>();
    this.nuevoValorEspecial = new EventEmitter<{ valor: number, fila: number }>();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      if(this.totalizable){
        this.nuevoValorEspecial.emit({fila: this.idFila, valor: this.valor!})
      }
    }, 60)
  }

  ngOnInit(): void {
    if(!this.valor){
      this.valor = SelectorCantidadComponent.VALOR_POR_DEFECTO
    }
    this.establecerInvalido(this.esInvalido())
  }

  manejarCambio(valor: number){
    if(this.valorValido(valor)){
      this.cambiarValor(valor)
    }
    else{
      this.cambiarValor(SelectorCantidadComponent.VALOR_POR_DEFECTO)
    }
  }

  manejarFoco(valor: number){
    if(valor === 0){
      this.valor = null
    }
  }

  manejarBlur(valor: number | null){
    if(!valor){
      this.valor = SelectorCantidadComponent.VALOR_MINIMO
    }
  }

  valorValido(valor: number): boolean{
    if( valor < SelectorCantidadComponent.VALOR_MINIMO || !valor )
      return false;
    else
      return true;
  }

  cambiarValor(valor: number){
    this.valor = valor;
    this.nuevoValor.emit(this.valor);
    if(this.totalizable){
      this.nuevoValorEspecial.emit({fila: this.idFila, valor: this.valor})
    }
    this.establecerInvalido(this.esInvalido())
    this.actualizarClases()
  }

  establecerHabilitado(habilitado: boolean){
    this.habilitado = habilitado
    this.invalido = this.esInvalido()
    this.actualizarClases()
  }

  esInvalido(){
    return  (!this.totalizable) && 
    ((this.valor!) < SelectorCantidadComponent.VALOR_MINIMO_NO_TOTALIZABLE) &&
    (this.habilitado) &&
    (this.estado)
  }

  establecerInvalido(invalido: boolean){
    this.invalido = invalido
    this.actualizarClases()
  }

  actualizarClases(){
    this.clases = {
      cero: this.valor === 0,
      invalido: this.invalido
    }
  }
}
