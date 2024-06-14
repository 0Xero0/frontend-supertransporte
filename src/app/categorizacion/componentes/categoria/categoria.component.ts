import { 
  AfterViewChecked, 
  AfterViewInit, 
  Component, 
  EventEmitter, 
  Input, 
  OnChanges, 
  OnInit, 
  Output, 
  QueryList, 
  SimpleChanges, 
  ViewChildren 
} from '@angular/core';
import { CategoriaClasificacion, Dato, TipoCategoria } from '../../modelos/Categorizacion';
import { SelectorCantidadComponent } from '../selector-cantidad/selector-cantidad.component';
import { ServicioClasificaciones } from '../../servicios/clasificaciones.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren('selector') selectores!: QueryList<SelectorCantidadComponent>
  @Output('cambioTotal') cambioTotal: EventEmitter<number>
  @Input('categoria') categoria!: CategoriaClasificacion
  @Input('tipoCategoria') tipoCategoria!: TipoCategoria
  total: number = 0
  descriptiva: boolean = false
  inconsistencia: boolean = false
  esIgualACero: boolean = false
  clases: any
  
  constructor(private servicio: ServicioClasificaciones){
    this.cambioTotal = new EventEmitter<number>()
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.calcularTotalInicial()
    }, 100) 
  }

  ngOnInit(): void {
    this.descriptiva = this.categoria.id === 4 ? true : false;
    this.clases = {
      'invalido': this.inconsistencia || this.esIgualACero
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.actualizarClasesTablaTotal()
  }

  // Fin del ciclo de vida

  manejarCambioDato(){
    this.calcularTotalSelectores()
  }

  manejarCambioDatoEspecial({valor, fila}: {valor: number, fila: number}){
    this.selectores.forEach( selector => {
      
      if(selector.idFila === fila && !selector.totalizable){
        if(valor <= 0){
          selector.establecerHabilitado(false)
        }else{
          selector.establecerHabilitado(true)
        }
      }
    })
  }

  selectoresValidos(): boolean{
    let validos = true;
    this.selectores.forEach( selector => {
      if(selector.invalido){
        validos = false;
      }
    })
    return validos;
  }

  calcularTotalInicial(){
    const columnaInicial = 0;
    if(this.descriptiva){
      this.cambiarTotal(this.servicio.totalCategoria(this.categoria, columnaInicial, columnaInicial))
    }else{
      this.cambiarTotal(this.servicio.totalCategoria(this.categoria))
    }
  }

  calcularTotalSelectores(){
    const columnaInicial = 0
    const primeraFila = this.categoria.filas[0]
    if(primeraFila){
      if(this.descriptiva){
        this.cambiarTotal(this.servicio.totalComponenteCategoria(this, columnaInicial, columnaInicial))
      }else{
        this.cambiarTotal(this.servicio.totalComponenteCategoria(this, columnaInicial, primeraFila.datos.length)) 
      }
    }else{
      this.cambiarTotal(0)
    }
  }

  obtenerDatos(): Dato[]{
    const datos: Dato[] = []
    this.selectores.forEach( selector =>{
      let dato: Dato = {
        idColumna: selector.idColumna,
        idFila: selector.idFila,
        valor: selector.valor!.toString(),
        estado: true
      }
      datos.push(dato)
    })
    return datos
  }

  establecerInconsistencia(inconsistencia: boolean){
    this.inconsistencia = inconsistencia
    this.actualizarClasesTablaTotal()
  }

  cambiarTotal(total: number){
    if(total === 0){
      this.esIgualACero = true;
    }else{
      this.esIgualACero = false;
    }
    
    this.total = total
    this.cambioTotal.emit(this.total)
  }

  actualizarClasesTablaTotal(){
    this.clases = {
      'invalido': this.inconsistencia || this.esIgualACero
    }
  }
}
