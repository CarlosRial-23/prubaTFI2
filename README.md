# ÚRSULA-2026

<p align="center">
  <img src="./src/assets/imagenes/banner-ursula.webp" alt="Banner Úrsula" width="100%">
</p>

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

# Sistema de Gestión para Restaurante

## Descripción

Aplicación desarrollada como Trabajo Final Integrador para la Tecnicatura Universitaria en Programación (UTN).

El sistema permite gestionar el flujo completo de clientes dentro de un restaurante, así como la interacción entre los distintos perfiles del sistema (dueño, supervisor, metre, mozo, cocinero, cantinero y cliente), desde el ingreso al local hasta su ubicación en una mesa y acceso al menú digital, dejando preparado el entorno para la gestión de pedidos.

---

## Seguimiento de Puntos Funcionales

Este cuadro detalla los requerimientos funcionales base del proyecto.

| ID | Funcionalidad (Objetivo) | Responsable | Sprint| Inicio | Fin | Estado |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **Desarrollo** | Desarrollo de Sprint 01| Nicolas M. | `Sprint 01` | 08/04 | 13/04 | Completo |
| **F1** | Alta de empleado (Escaneo DNI y Foto) | Carlos R. | `Sprint 01` | 11/04 | 16/04 | Completo |
| **F2** | Alta de nuevo plato (3 fotos y validación) | Carlos R. | `Sprint 01` | 11/04 | 21/04| Pendiente |
| **F3** | Alta de nueva bebida (3 fotos y validación) | Carlos R. | `Sprint 01` | 11/04 | 21/04 | Pendiente |
| **F4** | Alta de mesa (Foto, Capacidad y QR) | Carlos R. | `Sprint 01` |11/04| 16/04 | Completo |
| **F5** | Registro de cliente (DNI QR y foto) | Nicolas M. | `Sprint 01` | 11/04 | 21/04 | Pendiente |
| **F6** | Verificación de ingreso (Lista y Push) | Julian M. | `Sprint 01` | 11/04 | 21/04 | Pendiente |
| **F7** | Rechazo de cliente (Mail automático) | Nicolas M. | `Sprint 01` | 11/04 | 16/04 | Completo |
| **F8** | Aceptación de cliente (Mail automático) | Nicolas M. | `Sprint 01` | 11/04 | 16/04 | Completo |
| **F9** | Cliente anónimo y lista de espera | Julian M. | `Sprint 01` | 11/04 | 21/04 | Pendiente |
| **F10** | Asignación de mesa por parte del Metre | Julian M. | `Sprint 01` |11/04 | 21/04 | Pendiente |
| **F11** | Consulta al Mozo (Chat tiempo real) | Nicolas M. | `Sprint 01` |11/04 | 21/04 | Pendiente |
| **Desarrollo** | Desarrollo de Sprint 02 | Nicolas M. | `Sprint 02` | 19/04 | 21/04 |Pendiente |
| **F12** | Realización pedido y tiempo estimado | Por definir | Por definir | -- | -- | Pendiente |
| **F13** | Rechazo/Modificación pedido por Mozo | Por definir | Por definir | -- | -- | Pendiente |
| **F14** | Confirmación y derivación Cocina/Bar | Por definir | Por definir | -- | -- | Pendiente |
| **F15** | Acceso a juegos y descuentos (3 juegos) | Por definir |Por definir | -- | -- | Pendiente |
| **F16** | Gestión de pedidos: Sector Cocina | Por definir |Por definir | -- | -- | Pendiente |
| **F17** | Gestión de pedidos: Sector Bar | Por definir | Por definir | -- | -- | Pendiente |
| **F18** | Aviso automático de "Listo" al Mozo | Por definir | Por definir | -- | -- | Pendiente |
| **F19** | Entrega pedido y confirmación cliente | Por definir | Por definir | -- | -- | Pendiente |
| **F20** | Encuesta satisfacción y 3 Gráficos | Por definir | Por definir | -- | -- | Pendiente |
| **F21** | Solicitud cuenta, Propina y Pago | Por definir |Por definir | -- | -- | Pendiente |
| **F22** | Confirmación pago y liberación mesa | Por definir |Por definir | -- | -- | Pendiente |


---

## Objetivo del Sprint 1

Implementar la base del sistema contemplando:

* Registro y gestión de usuarios para todos los perfiles:

  * dueño
  * supervisor
  * metre
  * mozo
  * cocinero
  * cantinero
  * cliente (registrado y anónimo)

* Ingreso del cliente al sistema mediante QR

* Gestión de lista de espera

* Asignación de mesas por parte del metre

* Validación de mesa mediante QR

* Visualización del menú digital

* Comunicación básica entre cliente y mozo

---

## Alcance del Sprint 1

### Gestión de usuarios

* Alta de empleados (dueño / supervisor)
* Registro de cliente registrado
* Registro de cliente anónimo
* Login de usuarios
* Validación de datos
* Aprobación / rechazo de clientes
* Manejo de perfiles y permisos

---

### Interfaz de usuario

* Desarrollo de pantallas del sistema
* Navegación entre vistas
* Formularios y validaciones en frontend
* Visualización de información

Incluye además:

* Diseño del ícono de la aplicación
* Desarrollo de splash screen estática
* Desarrollo de splash screen dinámica
* Inclusión de nombres de los integrantes en la presentación

---

### Ingreso al local

* Escaneo de código QR de ingreso
* Acceso a funcionalidades iniciales

---

### Lista de espera

* Solicitud de mesa
* Registro en lista de espera
* Visualización por el metre

---

### Gestión de mesas

* Alta de mesas
* Asignación de mesa a cliente
* Control de estado de mesas
* Relación cliente-mesa
* Validaciones de asignación
* * Escaneo de QR de mesa
* Validación contra mesa asignada
* Restricción de acceso

---

### Productos y menú

* Alta de platos (cocinero)
* Alta de bebidas (cantinero)
* Gestión de productos
* Visualización del menú digital

---

### Comunicación cliente-mozo

* Consulta al mozo
* Envío y recepción de mensajes

---

### Notificaciones

Eventos del sistema:

* Registro de cliente
* Aprobación / rechazo
* Lista de espera
* Asignación de mesa
* Mensajes

---

## Modelo de datos

Entidades principales:

* usuarios
* mesas
* productos
* producto_imagenes
* lista_espera
* notificaciones
* mensajes

---

## Flujo del sistema

### Flujo de usuarios internos

Dueño / Supervisor → Alta de empleados y mesas
Cocinero / Cantinero → Alta de productos
Mozo → Interacción con clientes

---

### Flujo del cliente

Cliente → Registro / Anónimo
→ QR ingreso
→ Lista de espera
→ Asignación de mesa (metre)
→ Notificación
→ QR mesa
→ Validación
→ Menú
→ Consulta al mozo

---

## Tecnologías utilizadas

* Angular
* Ionic
* Supabase
* TypeScript
* HTML / CSS

---

## Metodología de trabajo

El desarrollo se organizó por módulos funcionales, permitiendo el trabajo en paralelo mediante el uso de ramas en Git e integración progresiva de funcionalidades.

---

## Responsabilidades del equipo

### Integrante 1

Apellido y Nombre: Julian Maldonado

Responsabilidades técnicas:

* Desarrollo de interfaces de usuario (UI/UX)
* Implementación de pantallas y navegación
* Construcción de formularios y validaciones en frontend
* Mejora de experiencia de usuario

Módulos (objetivos):

* Gestión de usuarios (interfaces y validaciones)
* Productos y menú (visualización)
* Lista de espera (interfaz y logica)
* Interfaz de usuario (incluye ícono y splash screen)

Fecha de inicio: 
Fecha de finalización: 21/04/2026

---

### Integrante 2

Apellido y Nombre: Carlos Rial

Responsabilidades técnicas:

* Modelado y administración de base de datos (Supabase)
* Definición de tablas y relaciones
* Implementación de consultas (queries)
* Desarrollo de lógica de negocio y validaciones

Módulos (objetivos):

* Modelado de base de datos
* Gestión de usuarios (persistencia y lógica)
* Gestión de mesas
* Lista de espera (lógica de negocio y validaciones)

Fecha de inicio: 
Fecha de finalización: 21/04/2025

---

### Integrante 3

Apellido y Nombre: Nicolas Moreyra

Responsabilidades técnicas:

* Integración entre frontend y backend
* Implementación de lógica funcional del sistema
* Desarrollo de funcionalidades con QR
* Manejo de eventos y comunicación entre módulos

Módulos (objetivos):

* Sistema de notificaciones por email
* Sistema de notificaciones push
* Comunicación cliente-mozo

Fecha de inicio: 
Fecha de finalización: 21/04/2025

---

## Estado del proyecto

Sprint 1: En proceso
Sprint 2 (gestión de pedidos): pendiente

---

## Seguimiento de Tareas Inntegrante 1 Julian Maldonado
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
## Seguimiento de Tareas Inntegrante 2 Carlos Rial Maldonado

| ID | Detalle| Refs Funcionales | Responsable/ s | Sprint | Inicio | Fin | Estado |
| :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: |
| **Desarrollo** | Exploracion de Tecnologias de Escaneo de QR | **F2, F3** |  Carlos Rial | `Sprint 1` | 11/04 | 16/04 | Completo |
| **Desarrollo** | Exploracion de Tecnologias de Generacion de QR | **F2, F3** |  Carlos Rial | `Sprint 1` | 11/04 | 16/04 | Completo |
| **Desarrollo** | Exploracion de Tecnologias de Almacenamiento | **F2, F3** |  Carlos Rial | `Sprint 1` | 11/04 | 16/04 | Completo |
| **Desarrollo** | Exploracion de Tecnologias de Camara | **F2, F3** |  Carlos Rial | `Sprint 1` | 11/04 | 16/04 | Completo |
| **Desarrollo** | Modelado de datos en supabase | **F2, F3** |  Carlos Rial | `Sprint 1` | 11/04 | 16/04 | Completo |
| **F1** | Alta de empleado (Escaneo DNI y Foto) | **F2, F3** |  Por definir | `---` | 11/04 | 16/04 | Completo |
| **F1** | Alta de Clientes (Escaneo DNI y Foto) | **F2, F3** |  Por definir | `---` | 11/04 | 16/04 | Completo |
| **F4** | Alta de mesa (Foto, Capacidad y QR) | Carlos R. | `Sprint 01` |11/04| 16/04 | Completo |
| **F2** | Alta de nuevo plato (3 fotos y validación) | Carlos R. | `Sprint 01` | 11/04 | 21/04| Pendiente |
| **F3** | Alta de nueva bebida (3 fotos y validación) | Carlos R. | `Sprint 01` | 11/04 | 21/04 | Pendiente |
| **F3** | Alta de Menu| Carlos R. | `Sprint 01` | 11/04 | 21/04 | Pendiente |


## Mapa de Códigos QR

| Ingreso al Local | Mesa (Cliente) | Propinas | 
| :---: | :---: | :---: | 
| <img src="./android/app/src/scripts/output_qrs/01-ingreso.png" width="150"> | <img src="./android/app/src/scripts/output_qrs/02-mesa-01.png" width="150"> | <img src="./android/app/src/scripts/output_qrs/04-propina-10.png" width="150">|
| **Acción:** Registro en espera | **Acción:** Menú y Pedidos | **Acción:** Feedback | 

---
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

