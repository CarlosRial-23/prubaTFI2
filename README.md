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

Este cuadro detalla los requerimientos funcionales base del proyecto.

| ID | Funcionalidad (Objetivo) | Responsable | Rama (Branch) | Inicio | Fin | Estado |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **F1** | Alta de empleado (Escaneo DNI y Foto) | Por definir | `---` | -- | -- | Pendiente |
| **F2** | Alta de nuevo plato (3 fotos y validación) | Por definir | `---` | -- | -- | Pendiente |
| **F3** | Alta de nueva bebida (3 fotos y validación) | Por definir | `---` | -- | -- | Pendiente |
| **F4** | Alta de mesa (Foto, Capacidad y QR) | Por definir | `---` | -- | -- | Pendiente |
| **F5** | Registro de cliente (DNI QR y foto) | Por definir | `---` | -- | -- | Pendiente |
| **F6** | Verificación de ingreso (Lista y Push) | Por definir | `---` | -- | -- | Pendiente |
| **F7** | Rechazo de cliente (Mail automático) | Por definir | `---` | -- | -- | Pendiente |
| **F8** | Aceptación de cliente (Mail automático) | Por definir | `---` | -- | -- | Pendiente |
| **F9** | Cliente anónimo y lista de espera | Por definir | `---` | -- | -- | Pendiente |
| **F10** | Asignación de mesa por parte del Metre | Por definir | `---` | -- | -- | Pendiente |
| **F11** | Consulta al Mozo (Chat tiempo real) | Por definir | `---` | -- | -- | Pendiente |
| **F12** | Realización pedido y tiempo estimado | Por definir | `---` | -- | -- | Pendiente |
| **F13** | Rechazo/Modificación pedido por Mozo | Por definir | `---` | -- | -- | Pendiente |
| **F14** | Confirmación y derivación Cocina/Bar | Por definir | `---` | -- | -- | Pendiente |
| **F15** | Acceso a juegos y descuentos (3 juegos) | Por definir | `---` | -- | -- | Pendiente |
| **F16** | Gestión de pedidos: Sector Cocina | Por definir | `---` | -- | -- | Pendiente |
| **F17** | Gestión de pedidos: Sector Bar | Por definir | `---` | -- | -- | Pendiente |
| **F18** | Aviso automático de "Listo" al Mozo | Por definir | `---` | -- | -- | Pendiente |
| **F19** | Entrega pedido y confirmación cliente | Por definir | `---` | -- | -- | Pendiente |
| **F20** | Encuesta satisfacción y 3 Gráficos | Por definir | `---` | -- | -- | Pendiente |
| **21** | Solicitud cuenta, Propina y Pago | Por definir | `---` | -- | -- | Pendiente |
| **22** | Confirmación pago y liberación mesa | Por definir | `---` | -- | -- | Pendiente |

---

## Seguimiento de Pantallas (Implementacion UX)
Cada pantalla agrupa las funcionalidades tecnicas detalladas en el cuadro anterior.

| ID | Pantallas | Refs Funcionales | Responsable/ s | Rama (Branch) | Inicio | Fin | Estado |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: |
| **P-A** | Splash Screen (Animada) | -- | Julian | `main` | 2026-04-06 | 2026-04-07 | Realizado |
| **P-B** | Login de Acceso Rápido | -- | Julian | `main` | 2026-04-07 | 2026-04-09 | Realizado |
| **P-C** | Registro de Cliente | **F5** | Julian | `main` | 2026-04-07 | 2026-04-09 | Realizado |
| **P-D** | Espera de Aprobación | **F6** | Por definir | `---`  | -- | -- | Pendiente |
| **P-E** | Home Ingreso (QR Puerta) | **F6, F9** | Por definir | `main` | 2026-04-09 | 2026-04-13 | Realizado |
| **P-F** | Sala de Espera / Juegos | **F15, F20** | Por definir | `---` | -- | -- | Pendiente |
| **P-G** | Validación de Mesa (QR) | **F21** | Por definir | `---` | -- | -- | Pendiente |
| **P-H** | Menú Digital / Pedidos | **F12, F13, F14** | Por definir | `---` | -- | -- | Pendiente |
| **P-I** | Chat con el Mozo | **F11** | Por definir | `---` | -- | -- | Pendiente |
| **P-J** | Dashboard Administrador | -- | Julian | `main` | 2026-04-14 | -- | En proceso |
| **P-K** | Aprobación de Clientes | **F7, F8** | Por definir | `---` | -- | -- | Pendiente |
| **P-L** | Alta de Empleados | **F1** | Carlos | `test` | 2026-04-14 | 2026-04-15 | Realizado |
| **P-M** | Alta de Mesas | **F4** | Carlos | `test` | 2026-04-15 | 2026-04-17 | Realizado |
| **P-N** | Dashboard Metre | **F9** | Por definir | `---` | -- | -- | Pendiente |
| **P-O** | Lista de Espera Detallada | **F9, F10** | Por definir | `---` | -- | -- | Pendiente |
| **P-P** | Mapa Salón (Asignación) | **F10, F22** | Por definir | `---` | -- | -- | Pendiente |
| **P-R** | Dashboard Especialista | **F18** | Por definir | `---` | -- | -- | Pendiente |
| **P-S** | Mis Productos / Comandas | **F16, F17** | Por definir | `---` | -- | -- | Pendiente |
| **P-T** | Alta de Producto | **F2, F3** | Por definir | `---` | -- | -- | Pendiente |


---

## Mapa de Códigos QR

| Ingreso al Local | Mesa (Cliente) | Propinas | 
| :---: | :---: | :---: | 
| <img src="./android/app/src/scripts/output_qrs/01-ingreso.png" width="150"> | <img src="./android/app/src/scripts/output_qrs/02-mesa-01.png" width="150"> | <img src="./android/app/src/scripts/output_qrs/04-propina-10.png" width="150">|
| **Acción:** Registro en espera | **Acción:** Menú y Pedidos | **Acción:** Feedback | 

---
## Rama test
 
#### 1. Entrar o crear la rama
```bash
git checkout -b test
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
git push origin test
```

## Calendario
### Entregas parciales:
* **Primera fecha de entrega (Primer parcial):** 30-05-2026
* **Segunda fecha de entrega (Segundo parcial):** 27-06-2026
### Pre-entregas:
<!-- * **Primera entrega:** 11-04-2026 -->

