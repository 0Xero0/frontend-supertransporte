import { Component, OnInit } from '@angular/core';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { ResumenReporte } from '../../modelos/ResumenReporte';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorizacionService } from 'src/app/categorizacion/servicios/categorizacion.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { FiltrosReportes } from '../../modelos/FiltrosReportes';

@Component({
  selector: 'app-listado-encuestas',
  templateUrl: './listado-encuestas.component.html',
  styleUrls: ['./listado-encuestas.component.css']
})
export class ListadoEncuestasComponent implements OnInit {
  paginador: Paginador<FiltrosReportes>
  usuarioCategorizado: boolean = true
  encuestaCategorizable: boolean = true
  usuario: Usuario | null
  rol: Rol | null
  reportes: ResumenReporte[] = []
  vigilado?: string
  idEncuesta?: number
  termino: string = ""

  constructor(
    private servicioEncuestas: ServicioEncuestas,
    private servicioCategorizacion: CategorizacionService,
    private servicioLocalStorage: ServicioLocalStorage, 
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.paginador = new Paginador<FiltrosReportes>(this.obtenerEncuestas)
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.rol = this.servicioLocalStorage.obtenerRol()
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) =>{
        this.idEncuesta = Number(params['idEncuesta'])
        this.servicioCategorizacion.informacionCategorizacion(this.idEncuesta).subscribe({
          next: ( informacion )=>{
            if(!informacion.categorizado && informacion.encuestaCategorizable){
              this.router.navigateByUrl('/administrar/categorizacion')
              return;
            }
            this.paginador.inicializar()
          }
        })
      }
    })
  }

  obtenerEncuestas = (pagina: number, limite: number, filtros?: FiltrosReportes)=> {
    return new Observable<Paginacion>(subscriptor => {
      this.servicioEncuestas.obtenerEncuestas(pagina, limite, this.usuario!.usuario, this.idEncuesta!, filtros).subscribe({
        next: ( respuesta )=>{
          this.reportes = respuesta.reportadas
          subscriptor.next(respuesta.paginacion)
        }
      })
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({ termino: this.termino })
  }

}
