import { Component, OnInit } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { ServicioVerificaciones } from '../../servicios/verificaciones.service';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Observable } from 'rxjs';
import { ResumenReporteFaseDosAsignado } from '../../modelos/ResumenReporteFaseDosAsignado';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';

@Component({
  selector: 'app-pagina-reportes-fase2-verificar',
  templateUrl: './pagina-reportes-fase2-verificar.component.html',
  styleUrls: ['./pagina-reportes-fase2-verificar.component.css']
})
export class PaginaReportesFase2VerificarComponent implements OnInit{
  paginador: Paginador<{idVerificador: string}>
  reportes: ResumenReporteFaseDosAsignado[] = []
  usuario: Usuario;

  constructor(private servicioVerificaciones: ServicioVerificaciones, private servicioLocalStorage: ServicioLocalStorage){
    const usuario = servicioLocalStorage.obtenerUsuario()
    if(!usuario) throw new ErrorAutorizacion();
    this.usuario = usuario
    this.paginador = new Paginador<{idVerificador: string}>(this.obtenerReportes);
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 5, { idVerificador: this.usuario.usuario })
  }

  obtenerReportes = (pagina: number, limite: number, filtros?: { idVerificador: string }) =>{
    return new Observable<Paginacion>((subscripcion) => {
      this.servicioVerificaciones.obtenerReportesFaseDos(pagina, limite, filtros).subscribe({
        next: (respuesta) =>{
          this.reportes = respuesta.asignadas
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }
}
