import { Component, OnInit } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';

@Component({
  selector: 'app-pagina-resultados-indicadores',
  templateUrl: './pagina-resultados-indicadores.component.html',
  styleUrls: ['./pagina-resultados-indicadores.component.css']
})
export class PaginaResultadosIndicadoresComponent implements OnInit {
  constructor(private servicioEncuestas: ServicioEncuestas){}

  ngOnInit(): void {
  }
}
