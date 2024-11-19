import { AfterViewChecked, AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Dato, TipoCategoria } from '../../modelos/Categorizacion';
import { CategoriaComponent } from '../categoria/categoria.component';
import { ServicioClasificaciones } from '../../servicios/clasificaciones.service';

@Component({
  selector: 'app-tipo-categoria',
  templateUrl: './tipo-categoria.component.html',
  styleUrls: ['./tipo-categoria.component.css']
})
export class TipoCategoriaComponent implements OnInit, AfterViewInit{
  @Input('tipoCategoria') tipoCategoria!:TipoCategoria
  @ViewChildren('categoria') categorias!: QueryList<CategoriaComponent>
  valido: boolean = true;
  inconsistencia: boolean = false;
  total: number = 0;

  constructor(private servicio: ServicioClasificaciones){
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.establecerInconsistencia(
        this.servicio.totalesCategoriasValidos(this.tipoCategoria.categoriaClasificacion)
      )
      this.validarTotalesMayoresACero()
      this.establecerTotal( this.categorias.get(0)!.total )
    }, 60)
  }

  esValido():boolean{
    if(this.inconsistencia){
      return false;
    }
    return true;
  }

  manejarCambioTotalCategoria(total: number){
    this.totalesComponentesCategoriaValidos()
    this.validarTotalesMayoresACero()
    this.establecerTotal(total)
  }

  totalesComponentesCategoriaValidos(){
    const inconsistencia = !this.servicio.totalesComponentesCategoriasValidos(this.categorias)
    this.establecerInconsistencia(inconsistencia)
    return !inconsistencia
  }

  validarTotalesMayoresACero():boolean{
    for (const categoria of this.categorias) {
      if(categoria.total <= 0){
        this.valido = false;
        return false;
      }
    }
    this.valido = true;
    return true
  }

  selectoresValidos(): boolean{
    let validos = true;
    this.categorias.forEach( categoria =>{
      if(!categoria.selectoresValidos()){
        validos = false;
      }
    })
    return validos;
  }

  establecerInconsistencia(inconsistencia: boolean){
    this.inconsistencia = inconsistencia
    this.categorias.forEach( categoriaComponent => {
      categoriaComponent.establecerInconsistencia(inconsistencia)
    })
  }

  obtenerDatos(): Dato[]{
    let datos: Dato[] = []
    this.categorias.forEach( categoria => {
      datos = [...datos, ...categoria.obtenerDatos()]
    })
    return datos
  }

  establecerTotal(total: number){
    this.total = total
  }
}
