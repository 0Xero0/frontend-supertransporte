//agregar el modelo con ua interfaz
export interface EmpresaTecnologica {
    idEmpresa: string;
    nombre: string;
    idVigilado: number;
    token: string;
    estado: boolean;
    documento: string;
    ruta: string;
    nombreOriginal: string;
    fechaInicialMostrar: string;
    fechaFinalMostrar: string
    fechaInicial: string;
    fechaFinal: string;
}
