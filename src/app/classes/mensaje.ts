export class Mensaje {
    id?: string;
    created_at?: string;
    mensaje?: string;
    usuarioUID?: {
        id?: string;      // <--- AGREGA ESTA LÍNEA
        nombres?: string;
    };

    constructor(id?: string, mensaje?: string, nombres?: string, idUsuario?: string) {
        this.id = id;
        this.mensaje = mensaje;
        this.usuarioUID = { 
            nombres: nombres,
            id: idUsuario // <--- AGREGA ESTO TAMBIÉN
        };
    }
}
