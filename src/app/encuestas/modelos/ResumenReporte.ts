export interface ResumenReporte {
    idEncuestaDiligenciada: number;
    idVigilado:             string;
    numeroReporte:          number;
    encuesta:               string;
    descripcion:            string;
    fechaInicio:            string;
    fechaFinal:             string;
    fechaEnvioST?:          string;
    vigencia:               number;
    razonSocial:            string;
    clasificacion:          string;
    nit:                    string;
    email:                  string;
    estado:                 string;
    asignado:               boolean;
    ultimoUsuarioAsignado:  string;
}
