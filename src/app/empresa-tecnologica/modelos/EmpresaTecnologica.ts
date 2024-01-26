//agregar el modelo con ua interfaz
export interface EmpresaTecnologica {
    idEmpresa: string;
    nombre: string;
    idVigilado: number;
    token: string;
    estado: boolean;
    fechaInicial: string;
    fechaFinal: string;
}