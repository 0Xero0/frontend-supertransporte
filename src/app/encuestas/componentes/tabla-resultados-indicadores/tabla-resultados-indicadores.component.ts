import { Component, Input, OnInit } from '@angular/core';
import { ResultadosIndicadores } from '../../modelos/ResultadosIndicadores';
import { ServicioEncuestas } from '../../servicios/encuestas.service';

@Component({
  selector: 'app-tabla-resultados-indicadores',
  templateUrl: './tabla-resultados-indicadores.component.html',
  styleUrls: ['./tabla-resultados-indicadores.component.css']
})
export class TablaResultadosIndicadoresComponent implements OnInit {
  resultadosIndicadores?: ResultadosIndicadores

  constructor(private servicioEncuesta: ServicioEncuestas){}

  ngOnInit(): void {
    this.servicioEncuesta.obtenerResultadosIndicadores(7107,900461196).subscribe({
      next: (resultados)=>{
        this.resultadosIndicadores = resultados
      }
    })
  }

}
