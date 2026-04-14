# ÚRSULA-2026

<p align="center">
  <img src="./src/assets/imagenes/banner-ursula.webp" alt="Banner Úrsula" width="100%">
</p>

## Guía de Instalación y Ejecución (Windows)

## 1. Requisitos Previos
1.  **Git:** [Descargar e instalar](https://git-scm.com/)
2.  **Node.js (LTS):** [Descargar e instalar](https://nodejs.org/) (incluye npm)
3.  **Ionic CLI:** Instalación global mediante terminal:
    ```bash
    npm install -g @ionic/cli
    ```
## 2. Configuración del Entorno
### Frontend (Node/Ionic):
#### Instalar módulos de Node
```bash
npm install
```
---

### 3. Clonar el Repositorio
Abre tu terminal (PowerShell o CMD) y ejecuta:

```bash
git clone [https://github.com/JulianJm04/ursula-2026.git](https://github.com/JulianJm04/ursula-2026.git)
cd ursula-2026
```
---
### 4. Ejecución de la Aplicación
Para levantar el servidor de desarrollo y la interfaz:

#### Opción recomendada
```bash
ionic serve
```
---

## Información Institucional
* **Universidad:** Universidad Tecnológica Nacional - Facultad Regional Avellaneda
* **Carrera:** Tecnicatura Universitaria en Programación
* **Materia:** Trabajo Final Integrador
* **Nombre del Grupo:** ursula-2026
* **Integrantes:** 
    * Maldonado, Julian
    * Rial, Carlos
    * Moreyra, Nicolás Rodrigo
* **Docentes:** 
    * Neiner, Maximiliano
    * Constanzo, Alejandro
    * Villegas, Octavio
    * Ferrero, Nicolás
    * Morelli, Augusto  
    * Loredo, Alejandro

---

## Seguimiento de Puntos Funcionales
| Punto | Funcionalidad (Objetivo) | Responsable | Rama (Branch) | Inicio | Fin | Estado |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **1** | Alta de empleado (Escaneo DNI y Foto) | **Por definir** | `funcionalidad/acceso-seguridad` | -- | -- |Pendiente|
| **2** | Alta de nuevo plato (3 fotos y validación) | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **3** | Alta de nueva bebida (3 fotos y validación) | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **4** | Alta de mesa (Foto, Capacidad y QR) | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **5** | Registro de cliente (DNI QR y pendiente) | **Por definir** | `funcionalidad/acceso-seguridad` | -- | -- |Pendiente |
| **6** | Verificación de ingreso (Lista y Push) | **Por definir** | `funcionalidad/acceso-seguridad` | -- | -- |Pendiente |
| **7** | Rechazo de cliente (Mail automático) | **Por definir** | `funcionalidad/acceso-seguridad` | -- | -- |Pendiente |
| **8** | Aceptación de cliente (Mail automático) | **Por definir** | `funcionalidad/acceso-seguridad` | -- | -- |Pendiente |
| **9** | Cliente anónimo y lista de espera | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **10** | Asignación de mesa por parte del Metre | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **11** | Consulta al Mozo (Chat tiempo real) | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **12** | Realización pedido y tiempo estimado | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **13** | Rechazo/Modificación pedido por Mozo | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **14** | Confirmación y derivación Cocina/Bar | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **15** | Acceso a juegos y descuentos (3 juegos) | **Por definir** | `funcionalidad/acceso-seguridad` | -- | -- |Pendiente |
| **16** | Gestión de pedidos: Sector Cocina | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **17** | Gestión de pedidos: Sector Bar | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **18** | Aviso automático de "Listo" al Mozo | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **19** | Entrega pedido y confirmación cliente | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |
| **20** | Encuesta satisfacción y 3 Gráficos | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **21** | Solicitud cuenta, Propina y Pago | **Por definir** | `funcionalidad/ventas-estadisticas` | -- | -- |Pendiente |
| **22** | Confirmación pago y liberación mesa | **Por definir** | `funcionalidad/logistica-operativa` | -- | -- |Pendiente |

---

## Mapa de Códigos QR

| Ingreso al Local | Mesa (Cliente) | Propinas | Documento (DNI) |
| :---: | :---: | :---: | :---: |
| <img src="./android/app/src/scripts/output_qrs/01-ingreso.png" width="150"> | <img src="./android/app/src/scripts/output_qrs/02-mesa-01.png" width="150"> | <img src="./android/app/src/scripts/output_qrs/04-propina-10.png" width="150"> | --- |
| **Acción:** Registro en espera | **Acción:** Menú y Pedidos | **Acción:** Feedback | **Acción:** Carga de datos |

---
## Rama A: funcionalidad/ acceso-seguridad
 
#### 1. Entrar o crear la rama
```bash
git checkout -b funcionalidad/acceso-seguridad
```

#### 2. Guardar los cambios realizados
```bash
git add .
```
#### 3. Crear el commit
```bash
git commit -m ""
```
#### 4. Subir los cambios a GitHub
```bash
git push origin funcionalidad/acceso-seguridad
```

---
## Rama B: funcionalidad/ logistica-operativa
 
#### 1. Entrar o crear la rama
```bash
git checkout -b feat/logistica-operativa
```

#### 2. Guardar los cambios realizados
```bash
git add .
```
#### 3. Crear el commit
```bash
git commit -m ""
```
#### 4. Subir los cambios a GitHub
```bash
git push origin funcionalidad/logistica-operativa
```
---

## Rama C: funcionalidad/ ventas-estadisticas
 
#### 1. Entrar o crear la rama
```bash
git checkout -b funcionalidad/ventas-estadisticas
```

#### 2. Guardar los cambios realizados
```bash
git add .
```
#### 3. Crear el commit
```bash
git commit -m ""
```
#### 4. Subir los cambios a GitHub
```bash
git push origin funcionalidad/ventas-estadisticas
```

## Calendario
### Entregas parciales:
* **Primera fecha de entrega (Primer parcial):** 30-05-2026
* **Segunda fecha de entrega (Segundo parcial):** 27-06-2026
### Pre-entregas:
* **Primera entrega:** 11-04-2026

