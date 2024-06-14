import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { CategorizacionService } from '../../servicios/categorizacion.service';
import { Categorizacion, Dato } from '../../modelos/Categorizacion';
import { TipoCategoriaComponent } from '../../componentes/tipo-categoria/tipo-categoria.component';
import { FormularioModalidadRadioOperacionComponent } from '../../componentes/formulario-modalidad-radio-operacion/formulario-modalidad-radio-operacion.component';
import { PeticionGuardarCategorizacion } from '../../modelos/PeticionGuardarCategorizacion';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ModalConfirmacionComponent } from '../../componentes/modal-confirmacion/modal-confirmacion.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-categorizacion',
  templateUrl: './pagina-categorizacion.component.html',
  styleUrls: ['./pagina-categorizacion.component.css']
})
export class PaginaCategorizacion implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modalConfirmacion') modalConfirmacion!: ModalConfirmacionComponent
  @ViewChildren('tipoCategoria') tiposCategoria!: QueryList<TipoCategoriaComponent>
  @ViewChild('formularioModalidades') formularioModalidadesRadios!: FormularioModalidadRadioOperacionComponent
  usuario: Usuario
  filtros?: Categorizacion
  debePresentarPesv: boolean = true

  constructor(
    private localStorage: ServicioLocalStorage, 
    private servicioCategorizacion: CategorizacionService,
    private router: Router
    ){
    const usuario = this.localStorage.obtenerUsuario()
    if(!usuario){
      throw new ErrorAutorizacion()
    }
    this.usuario = usuario
  }

  ngOnInit(): void {
    this.servicioCategorizacion.obtenerFiltros(this.usuario.id).subscribe({
      next: (filtros)=>{
        this.filtros = filtros
      }
    })
  }

  totalesValidos(): boolean{
    let totalesValidos = true
    this.tiposCategoria.forEach( tipoCategoria => {
      if(!tipoCategoria.totalesComponentesCategoriaValidos()){
        totalesValidos = false
      }
    })
    return totalesValidos
  }

  totalesMayoresACero(): boolean{
    let totalesValidos = true
    this.tiposCategoria.forEach( tipoCategoria => {
      if(!tipoCategoria.validarTotalesMayoresACero()){
        totalesValidos = false
      }
    })
    return totalesValidos
  }

  selectoresValidos(): boolean{
    let validos = true;
    this.tiposCategoria.forEach( tipo =>{
      if(!tipo.selectoresValidos()){
        validos = false;
      }
    })
    return validos;
  }

  estaAgregandoModuloRadio(): boolean{
    return this.formularioModalidadesRadios.estaAgregandoModuloRadio()
  }

  alMenosUnModuloRadio(): boolean{
    return this.formularioModalidadesRadios.valido
  }

  obtenerDatos(): Dato[]{
    let datos: Dato[] = []
    this.tiposCategoria.forEach( categoria => {
      datos = [...datos, ...categoria.obtenerDatos()]
    })
    return datos
  }

  obtenerTotalesPorTipoCategoria(){
    const idTipoConductores = 1;
    const idTipoVehiculos = 2;
    let totalConductores = 0;
    let totalVehiculos = 0;
    this.tiposCategoria.forEach( tipoCategoria => {
      console.log('tipoCategoria', tipoCategoria)
      if(tipoCategoria.tipoCategoria.idTipo === idTipoConductores){
        console.log('total conductores:', tipoCategoria.total)
        totalConductores = tipoCategoria.total
      }
      if(tipoCategoria.tipoCategoria.idTipo === idTipoVehiculos){
        console.log('total vehiculos:', tipoCategoria.total)
        totalVehiculos = tipoCategoria.total
      }
    })
    return {conductores: totalConductores, vehiculos: totalVehiculos}
  }

  guardarInformacion(){
    if(!this.alMenosUnModuloRadio()){
      this.popup.abrirPopupFallido(
        'Datos de modalidad y radio incorrectos.', 
        'Debe haber por lo menos un dato de radio y modalidad.'
      )
      return;
    }
    if(this.estaAgregandoModuloRadio()){
      this.popup.abrirPopupFallido(
        'Hay cambios en curso.', 
        'Estás agregando datos de modalidad y radio de acción.\nConfirma o cancela los cambios para poder continuar.'
      )
      return;
    }
    if(this.debePresentarPesv && (!this.totalesValidos() || !this.totalesMayoresACero())){
      this.popup.abrirPopupFallido('Totales inválidos.', 'Porfavor rectifica que los totales coinciden y son mayores a cero.')
      return;
    }
    if(this.debePresentarPesv && !this.selectoresValidos()){
      this.popup.abrirPopupFallido('Valores inválidos.', 'Porfavor rectifica que todas las celdas contengan un valor válido.')
      return;
    }

    this.modalConfirmacion.abrir({
      alAceptar: ()=>{
        const info: PeticionGuardarCategorizacion = {
          datos: this.obtenerDatos(),
          modalidadesRadio: this.formularioModalidadesRadios.registrosACrear,
          modalidadesRadioEliminar: this.formularioModalidadesRadios.registrosAEliminar,
          totales: this.obtenerTotalesPorTipoCategoria()
        }
        this.servicioCategorizacion.guardarInformacionCategorizacion(info).subscribe({
          next: (respuesta: any)=>{
            this.router.navigateByUrl(`/administrar/asignacion?clasificacion=${respuesta.nombre}`)
          }
        })
      },
      alCancelar: ()=>{}
    })
  }

  setDebePresentarPesv(debePresentarPesv: boolean): void{
    this.debePresentarPesv = debePresentarPesv
  }
}
