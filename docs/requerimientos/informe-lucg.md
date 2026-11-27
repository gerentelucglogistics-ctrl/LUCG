# Informe de LUCG para la realización del sistema y la aplicación de paquetería

> Documento de requerimientos entregado por LUCG LOGISTICS (convertido desde el .docx original, noviembre de 2026).
> Es el punto de vista del cliente: usa "paquete" y "cliente"; en la plataforma los términos son envío/bulto y cuenta (skill `lucg-dominio`).

**1. SISTEMA ADMINISTRATIVO GENERAL**

Este será el centro de control de la operación logística.

Aquí trabajará el personal administrativo, los coordinadores de bodega,
los supervisores y la gerencia, cada uno con permisos según sus
responsabilidades.

**1.1. Inicio de sesión y administración de usuarios**

El sistema debe permitir que cada trabajador autorizado ingrese con su
propio usuario y contraseña.

El administrador principal podrá crear, editar, activar, desactivar y
asignar permisos a los usuarios.

**Tipos de usuarios que recomiendo**

  -----------------------------------------------------------------------
  Perfil                Funciones principales
  --------------------- -------------------------------------------------
  Superadministrador    Configuración general y control de toda la
                        plataforma.

  Gerencia              Consulta de indicadores, resultados, clientes y
                        operaciones.

  Administrador         Control de paquetes, asignaciones, novedades y
  operativo             despachos.

  Personal de bodega    Recepción, escaneo, clasificación, entrega y
                        devolución de paquetes.

  Coordinador de rutas  Asignación de paquetes, repartidores y vehículos.

  Servicio al cliente   Consulta de envíos, seguimiento y atención de
                        novedades.

  Facturación y cartera Tarifas, cobros, facturación y pagos.

  Cliente empresarial   Acceso exclusivo a sus propios envíos y reportes.
                        (Clientes final directo)
  -----------------------------------------------------------------------

Los permisos específicos se configurarán de acuerdo con cada función.

Seguridad: un usuario de un cliente no puede consultar los paquetes, las
tarifas ni la información privada de otro cliente.

También se debe registrar quién realizó cada acción importante, cuándo
la realizó y qué información modificó.

**1.2. Panel principal de operaciones**

Al ingresar, el administrador debe encontrar un tablero con el estado
general de la operación.

Por ejemplo:

  -----------------------------------------------------------------------
  Indicador           Información que debe mostrar
  ------------------- ---------------------------------------------------
  Paquetes recibidos  Cantidad de paquetes ingresados a la operación.

  En inventario       Paquetes recibidos que todavía no han sido
                      asignados a una ruta.

  Asignados a         Paquetes asignados para su distribución.
  repartidores        

  En ruta             Paquetes que están en proceso de entrega.

  Entregados          Paquetes con entrega confirmada y evidencia válida.

  Con novedades       Paquetes con una incidencia registrada.

  Pendientes de       Paquetes que aún requieren gestión.
  entrega             

  Entrega urgente     Paquetes próximos a incumplir el plazo de entrega.

  Devueltos a bodega  Paquetes que regresaron físicamente a las
                      instalaciones.

  PQR                 Paquetes que los clientes, realiza reclamación,
                      queja o Petición. (por medio de la plataforma)
  -----------------------------------------------------------------------

Es importante tener conocimiento que se debe definir con precisión qué
significa cada estado.

Por ejemplo, un paquete asignado a un repartidor no necesariamente está
en ruta. Puede seguir físicamente en la bodega o está en tránsito
(quiere decir que los paquetes está en camino para que el repartido lo
puede recibir o no ha llegado al lugar destinado)

Por eso, propongo diferenciar los siguientes estados:

-   Recibido en bodega.

-   En clasificación.

-   Disponible para asignación.

-   Asignado al repartidor.

-   Recibido por repartidor.

-   En ruta de entrega.

-   Entregado.

-   Novedad reportada.

-   Pendiente de reintento.

-   Devuelto a bodega.

-   En proceso de devolución al remitente.

-   Devuelto al remitente.

El sistema debe evitar que un mismo paquete aparezca simultáneamente
como entregado y pendiente de entrega.

También debe conservar el historial de los estados anteriores. Si un
paquete cambia de estado, no se debe borrar lo que sucedió
anteriormente.

**1.3. Módulo de gestión de paquetes**

Este módulo permitirá consultar y administrar todos los paquetes que
maneja LUCG LOGISTICS.

Cada paquete debe tener un registro individual.

**Información general del paquete**

  -----------------------------------------------------------------------
  Campo                    Descripción
  ------------------------ ----------------------------------------------
  Número de guía           Identificador único del envío.

  Código de barras o QR    Código para identificar y escanear el paquete.

  Cliente remitente        Empresa o persona que contrata el servicio.

  Nombre del destinatario  Persona que debe recibir el envío.

  Teléfono del             Número de contacto.
  destinatario             

  Dirección de entrega     Dirección completa.

  Municipio y departamento Localización del destino.

  Contenido declarado      Descripción de la mercancía.

  Cantidad                 Número de unidades o bultos asociados.

  Peso                     Peso registrado del envío.

  Dimensiones              Largo, ancho y alto, cuando aplique.

  Valor declarado          Valor de la mercancía informado por el
                           remitente.

  Valor del servicio       Precio cobrado por el transporte o la entrega.

  Empresa de origen        Empresa transportadora o remitente, según
                           corresponda.

  Fecha de recepción       Momento en que LUCG recibe el paquete.

  Fecha límite de entrega  Fecha objetivo de cumplimiento.

  Estado actual            Situación del paquete.

  Repartidor asignado      Responsable de la distribución.

  Vehículo asociado        Vehículo utilizado, cuando aplique.

  Historial                Registro cronológico de los movimientos.
  -----------------------------------------------------------------------

El sistema también deberá admitir observaciones, instrucciones de
entrega y documentos adjuntos cuando sean necesarios.

**Búsquedas y filtros**

El administrador podrá buscar un paquete por:

-   Número de guía.

-   Nombre o documento del destinatario, si es necesario y está
    autorizado.

-   Teléfono.

-   Cliente remitente.

-   Municipio.

-   Fecha de recepción.

-   Estado.

-   Repartidor.

-   Vehículo.

-   Empresa transportadora.

También podrá descargar reportes en Excel o CSV con los filtros
aplicados.

El sistema deberá respetar los permisos de cada usuario y evitar
exportar información que no esté autorizado a consultar.

**Recepción y control de inventario en bodega**

Este módulo es fundamental porque aquí comienza la trazabilidad física
del paquete.

El proceso propuesto es el siguiente:

**Paso 1. Recepción física.**

La bodega recibe los paquetes provenientes del cliente o de la empresa
transportadora.

**Paso 2. Registro de ingreso.**

El trabajador escanea el código de barras o ingresa el número de guía.

El sistema consulta si el paquete ya existe.

Si existe, debe evitar crear un segundo registro y advertir al
trabajador para que verifique si se trata de una recepción duplicada.

Si es un paquete nuevo, se registra la información correspondiente.

**Paso 3. Verificación.**

El trabajador verifica la cantidad recibida y, según el procedimiento
acordado, el estado externo del paquete.

Si encuentra daños, diferencias o faltantes, registra la novedad y las
evidencias necesarias.

**Paso 4. Confirmación de recepción.**

El sistema guarda la fecha, hora, usuario responsable y lugar de
recepción.

**Paso 5. Clasificación.**

Los paquetes se organizan por municipio, zona, prioridad, cliente u otro
criterio operativo.

**Paso 6. Disponibilidad.**

Una vez completadas las verificaciones, el paquete queda disponible para
asignación.

El sistema debe distinguir entre:

-   Paquetes que figuran en el sistema.

-   Paquetes que están físicamente en bodega.

-   Paquetes disponibles para despacho.

-   Paquetes bloqueados por alguna novedad.

Esta distinción permitirá detectar diferencias entre el inventario
físico y el inventario registrado.

**1.5. Módulo de creación y asignación de repartidores**

El administrador debe poder registrar a cada repartidor con su
información básica y su identificación operativa.

Los datos podrían incluir:

-   Nombre completo.

-   Documento de identificación.

-   Teléfono.

-   Usuario de acceso.

-   Estado de la cuenta.

-   Zona o municipios asignados.

-   Fecha de vinculación.

-   Vehículo autorizado.

-   Documentación y requisitos operativos aplicables.

Los datos personales y documentos deberán tener acceso restringido.

**¿Cómo funciona la asignación?**

Imaginemos que el repartidor Carlos debe distribuir 50 paquetes.

1.  Se clasifica los paquetes para el repartidor Carlos que son 50
    paquetes

2.  El encargado ingresa al módulo de asignación.

3.  Selecciona al repartidor Carlos.

4.  Selecciona la ruta o zona correspondiente.

5.  Asocia el vehículo, cuando aplique.

6.  Escanea los 50 paquetes

7.  Confirma la asignación.

8.  El sistema registra quién realizó la asignación y cuándo.

9.  Los 50 paquetes aparecen en la aplicación de Carlos.

Sin embargo, aquí debemos implementar un control adicional: **asignar un
paquete no significa que el repartidor ya lo haya recibido
físicamente**.

Por eso, el sistema tendrá que diferenciar entre asignación, entrega
física al repartidor que quiere decir que esta para salida a ruta.

Si se intenta asignar un paquete que ya está asignado a otro repartidor,
el sistema deberá advertirlo y exigir que se gestione la reasignación.

**1.6. Módulo de vehículos**

Necesitamos identificar qué vehículo transportó cada paquete.

El sistema debe tener un registro de vehículos con campos como:

-   Placa.

-   Tipo de vehículo.

-   Capacidad.

-   Propietario o proveedor.

-   Conductor autorizado.

-   Estado operativo.

-   Documentación y fechas de vencimiento pertinentes.

-   Observaciones.

Cuando se prepare una ruta, se podrá asociar un vehículo si el vehículo
es de la empresa o tercero, pero cuando se le asigne a un repartidor
automáticamente debe de aparecer el vehículo del repartidor.

El historial de cada envío debe conservar la información del vehículo
utilizado en cada etapa relevante.

Esto es especialmente importante cuando un paquete pasa por diferentes
vehículos antes de llegar al destinatario.

También recomiendo registrar la salida y el regreso del vehículo, junto
con los responsables de cada movimiento.

**1.7. Alertas de entregas urgentes**

Esta es una de las funciones que más valor pueden aportar a LUCG.

El sistema debe identificar los paquetes que necesitan atención
prioritaria.

Para ello, cada envío debe tener una fecha u hora límite de entrega, de
acuerdo con el servicio contratado.

El sistema comparará ese plazo con el estado actual del paquete.

Por ejemplo:

-   **Verde:** entrega dentro del plazo previsto.

-   **Amarillo:** entrega próxima a vencer.

-   **Rojo:** plazo de entrega vencido.

Los colores son una propuesta visual; los tiempos concretos deben
definirse según las promesas de servicio de LUCG y de cada cliente.

Las alertas podrán aparecer en el tablero administrativo con los colores
y las cantidades y en las listas de trabajo de los usuarios autorizados.

También se puede establecer que el sistema notifique al coordinador
cuando un paquete urgente no haya sido asignado o cuando una entrega se
encuentre en riesgo.

No debemos depender solamente del color: el sistema tiene que mostrar la
fecha límite y el tiempo restante o transcurrido.

**1.8. Módulo de novedades y problemas**

El sistema debe registrar las incidencias de manera organizada.

Propongo comenzar con las siguientes categorías:

  -----------------------------------------------------------------------
  Categoría       Razones            Ejemplo
  --------------- ------------------ ------------------------------------
  No entregado    No contactable /   No fue posible comunicarse con el
                  Apagado            destinatario.

  Reprogramado    Reprogramado       El destinatario solicita otra fecha.

  No Entregado    Rechazado          El destinatario no acepta el
                                     paquete.

  Debido al       Dirección          La dirección no coincide o no se
  cliente         incorrecta         encuentra.

  Reprogramado    Zona peligrosa     No es posible realizar la entrega
                                     por razones de seguridad.

  Reprogramado    Condiciones        Lluvias, inundaciones u otras
                  naturales          circunstancias que impiden la
                                     entrega.

  No entregado    Destinatario       No hay quien reciba el paquete.
                  ausente            

  Novedad         Paquete dañado     Se detecta un daño que requiere
                                     evaluación.

  Novedad         Otras novedades    Incidencias que no encajan en las
                                     categorías anteriores.
  -----------------------------------------------------------------------

Cada novedad debe registrar:

-   Número de guía.

-   Categoría.

-   Razones

-   Descripción del problema.

-   Fecha y hora.

-   Repartidor responsable.

-   Evidencias fotográficas o documentales.

-   Acción requerida.

-   Responsable del seguimiento.

-   Estado de resolución.

**¿Qué sucede cuando se reporta una novedad?**

El paquete deja de figurar entre las tareas normales pendientes de
entrega de ese repartidor y pasa a la sección de novedades.

Pero debemos tener cuidado: esto no significa que el paquete desaparezca
del control operativo.

El sistema debe conservarlo en el inventario lógico y físico que
corresponda, mostrar quién lo tiene, debe de realizar 3 intentos en tres
días, porque desde el primer reporte le aparecerá al cliente dueño del
paquete que el paquete tiene novedad, para que ellos pueden revisar y
comunicarse con la empresa que le debe de aparecer el número de teléfono
quien tiene el paquete asignado y después de este procedimiento permitir
que el coordinador determine el siguiente paso.

Por ejemplo, podría:

-   Autorizar un nuevo intento.

-   Reprogramar la entrega.

-   Cambiar la dirección.

-   Asignar otro repartidor.

-   Ordenar la devolución a bodega.

-   Iniciar la devolución al remitente.

Cada decisión debe quedar registrada.

**2. SEGUNDO COMPONENTE: APLICACIÓN MÓVIL DEL REPARTIDOR**

Esta será la herramienta que utilizarán los domiciliarios desde su
celular.

Mi recomendación es diseñarla para que sea sencilla, con botones
grandes, pocos pasos y mensajes claros.

La aplicación deberá conectarse al sistema administrativo, pero también
tendremos que definir qué sucede cuando el repartidor pierde la señal de
internet.

**2.1. Inicio de sesión**

Cada repartidor tendrá su propio usuario y contraseña.

Al ingresar, el sistema validará sus credenciales y consultará las
tareas que tiene asignadas.

El repartidor solo podrá acceder a la información necesaria para cumplir
sus funciones.

**2.2. Pantalla principal**

La pantalla de inicio tendrá accesos a las siguientes opciones:

1.  Mis tareas de hoy.

2.  Escáner de entrega.

3.  Reportar un problema.

4.  Paquetes entregados.

5.  Problemas reportados.

6.  Paquetes pendientes o por devolver, cuando corresponda.

7.  Mi perfil y cierre de sesión.

Podremos agregar otras funciones cuando se definan las necesidades
operativas.

**2.3. Escanear para generar Tarea**

Cuando el coordinador asigne 50 paquetes a un repartidor, la aplicación
deberá mostrar: el número 50 en rojo que están pendiente de escanear
para que automáticamente les aparezca en las tareas de hoy.

**Mis tareas de hoy: 50 paquetes asignados.**

Cada paquete aparecerá en una lista con la información necesaria para
realizar la entrega.

Por ejemplo:

-   Nombre del destinatario.

-   Número de guía.

-   Cantidad de paquetes asociados a ese destinatario.

-   Dirección.

-   Municipio.

-   Teléfono.

-   Observaciones para la entrega.

Al lado de la información de contacto, se mostrarán accesos rápidos
para:

-   Llamar al destinatario.

-   Abrir WhatsApp.

-   Consultar la ubicación en un servicio de mapas.

Estos accesos deberán funcionar según la información disponible y los
permisos del dispositivo.

Si un mismo destinatario tiene varios paquetes, la aplicación podrá
agruparlos visualmente para facilitar la operación.

No obstante, cada paquete deberá conservar su propia guía y su propio
estado.

**2.4. Confirmación de los paquetes recibidos**

Esta función es esencial para controlar la entrega de paquetes desde la
bodega hacia el repartidor.

Supongamos que Carlos tiene asignados 50 paquetes.

La aplicación debe mostrar:

-   Paquetes asignados: 50.

-   Paquetes escaneados: 0.

-   Paquetes pendientes de verificar: 50.

Carlos comienza a escanear cada paquete.

Por cada lectura válida, el sistema verifica que la guía corresponda a
un paquete asignado a Carlos y registra su recepción.

Después de escanearlos todos, el resultado será:

  -----------------------------------------------------------------------
  **Concepto**                                     **Cantidad**
  ------------------------------------------------ ----------------------
  Paquetes asignados                               50

  Paquetes escaneados                              50
  -----------------------------------------------------------------------

Si Carlos solo recibe 48, la aplicación deberá mostrar la diferencia y
evitar que confirme que recibió los 50.

Quiere decir que si tiene 50 paquetes asignados y solo recibe 48 y
escaneo 48 le deben de quedar pendiente los dos paquetes.

El coordinador tendrá que resolver los dos paquetes faltantes antes de
cerrar el proceso o autorizar una excepción debidamente registrada.

**Importante:** el escaneo confirma la recepción física registrada por
el trabajador; no sustituye por sí solo la verificación de que cada
paquete se encuentra realmente en su poder.

Una vez confirmada la recepción, la aplicación mostrará los paquetes
disponibles para iniciar la ruta, según las reglas de operación.

**2.5. Escáner de entrega**

Esta pantalla permitirá escanear el código de barras o ingresar
manualmente el número de guía.

El proceso será:

1.  El repartidor abre «Escáner de entrega».

2.  La aplicación activa la cámara.

3.  Escanea el código de barras.

4.  El sistema identifica el paquete.

5.  Verifica que esté asignado al repartidor y que su estado permita
    realizar la entrega.

6.  Muestra la información necesaria para confirmar que se trata del
    paquete correcto.

7.  El repartidor continúa con el proceso de entrega.

Si el paquete no está asignado al repartidor, ya fue entregado o
presenta alguna restricción, la aplicación debe mostrar una advertencia
y evitar una entrega duplicada.

También debe existir una alternativa de búsqueda manual cuando el código
esté dañado o no pueda leerse.

**2.6. Confirmación de quién recibe el paquete**

Después de identificar el paquete, la aplicación mostrará las opciones
para registrar al receptor.

Podemos incluir:

-   Destinatario. (En persona)

-   Familiar

-   Amigo.

-   Vecino.

-   Portería o recepción autorizada.

-   Otro autorizado.

Estas categorías deben adaptarse a las condiciones de entrega de cada
cliente.

Si recibe una persona distinta al destinatario, el repartidor deberá
registrar su nombre completo y, cuando corresponda según las políticas
del servicio, su relación con el destinatario.

Si recibe directamente el destinatario, la aplicación podrá recuperar su
nombre desde la información de la guía.

Si recibe otra persona, no debe asumir que es el destinatario ni
registrar automáticamente el nombre del destinatario como si hubiera
recibido el paquete.

Además, el sistema debe contemplar las reglas de autorización aplicables
a cada cliente.

**2.7. Firma del receptor**

Aquí debemos diferenciar dos conceptos:

**Nombre de quien recibe:** campo donde se registra el nombre de la
persona que recibió físicamente el paquete.

**Firma de quien recibe:** espacio donde esa persona dibuja su firma en
la pantalla del celular, cuando el procedimiento de entrega la requiera.

Si recibe una persona diferente al destinatario, la firma debe
corresponder a quien efectivamente recibió el paquete.

El sistema debe guardar la firma asociada a la guía correspondiente.

la aplicación permita al repartidor firmar en nombre del receptor. Y
otras no (depende del cliente)

La interfaz debe dejar claro quién está firmando y para qué.

**2.8. Evidencias fotográficas de la entrega**

La aplicación debe permitir tomar y adjuntar fotografías.

Propongo que el sistema pueda exigir, según el cliente y el tipo de
entrega:

-   Fotografía del paquete entregado.

-   Fotografía del paquete en el lugar de entrega, cuando esté
    permitido.

-   Evidencia del documento o comprobante firmado, cuando aplique.

-   Otras fotografías exigidas por el procedimiento del cliente.

El sistema deberá permitir configurar cuáles evidencias son obligatorias
para cada operación.

Si se exigen cuatro fotografías, por ejemplo, la aplicación no permitirá
cerrar la entrega hasta que estén cargadas las cuatro.

También recomiendo evitar fotografías innecesarias de rostros,
documentos personales u otros datos sensibles. Las evidencias deben ser
suficientes para demostrar la entrega y cumplir las políticas de
privacidad.

La aplicación debe guardar la fecha y hora del registro de las
evidencias, así como el usuario que las cargó.

**2.9. Confirmación final de la entrega**

Una vez registrados el receptor, la firma y las evidencias exigidas, el
repartidor podrá pulsar «Confirmar entrega».

Antes de finalizar, la aplicación debe validar que no falte ningún campo
obligatorio.

Si todo está correcto:

1.  El sistema registra la entrega.

2.  Guarda la fecha y hora.

3.  Actualiza el estado del paquete.

4.  Guarda la identidad del repartidor.

5.  Conserva las evidencias.

6.  Actualiza el historial.

7.  Retira el paquete de las tareas pendientes de ese repartidor.

8.  Lo incorpora a sus entregas completadas.

9.  Actualiza el tablero administrativo.

10. Actualiza el seguimiento visible para el cliente, según los permisos
    y el nivel de información autorizado.

Si el envío contiene varios paquetes físicos, el sistema debe permitir
registrar qué unidades fueron entregadas y cuáles siguen pendientes.

Así evitamos que una entrega parcial se registre como una entrega
completa.

**2.10. Sección de entregados**

El repartidor podrá consultar los paquetes que ya entregó.

La aplicación debe incluir filtros por:

-   Fecha inicial.

-   Fecha final.

-   Número de guía.

-   Cliente.

-   Estado.

Al abrir un paquete, podrá consultar la información autorizada, por
ejemplo:

-   Número de guía.

-   Nombre del destinatario.

-   Cliente remitente.

-   Peso y contenido declarado.

-   Cantidad de unidades.

-   Fecha y hora de entrega.

-   Nombre de quien recibió.

-   Firma.

-   Fotografías.

-   Historial del envío.

El acceso a la información debe limitarse a las necesidades de la
operación. No todos los repartidores deben poder consultar
indefinidamente toda la información histórica de todos los clientes.

**2.11. Reportar un problema**

La aplicación tendrá una opción visible llamada «Reportar un problema».

El proceso será:

1.  El repartidor abre la opción.

2.  Escanea el paquete.

3.  El sistema verifica que tenga autorización para gestionar ese envío.

4.  Selecciona la categoría de novedad.

5.  Selecciona la razón.

6.  Describe lo sucedido.

7.  Adjunta las evidencias obligatorias.

8.  Confirma el reporte.

Las categorías y la razones serán las que definimos en el sistema
administrativo: no contactable, reprogramado, rechazado, dirección
incorrecta, zona peligrosa, condiciones naturales y otras que LUCG
autorice.

El sistema registrará la novedad y la mostrará tanto en la aplicación
como en el panel administrativo.

El paquete dejará de aparecer en las tareas normales pendientes de ese
repartidor cuando la regla operativa así lo determine.

Sin embargo, seguirá visible en la sección de problemas reportados y en
el control general de la operación.

**¿Qué sucede después de reportar el problema?**

El coordinador podrá revisar la novedad y verificar si corresponde un
nuevo intento, una reprogramación, una reasignación o una devolución con
las evidencias que subió y que aparecen en el sistema.

No todas las novedades deben generar automáticamente el mismo resultado.

Por ejemplo, una dirección incorrecta puede requerir validación antes de
asignar nuevamente el paquete.

Una situación de seguridad puede exigir que se suspenda la entrega hasta
que el coordinador autorice otra alternativa.

**2.12. Reasignación de paquetes entre repartidores**

Este proceso debe diseñarse cuidadosamente.

Imaginemos que Carlos tiene un paquete asignado, pero no podrá
entregarlo. Otro repartidor, Andrés, debe realizar la entrega.

El flujo propuesto es:

1.  El coordinador autoriza la reasignación, o se habilita una regla
    específica para que otro repartidor la solicite.

2.  Andrés escanea la guía.

3.  El sistema verifica el estado actual del paquete.

4.  Valida que la reasignación esté autorizada.

5.  Registra quién entrega y quién recibe el paquete físicamente.

6.  Actualiza la asignación.

7.  Retira el paquete de las tareas pendientes de Carlos.

8.  Lo incorpora a las tareas de Andrés.

9.  Conserva el historial de la asignación anterior.

Si Carlos ya había confirmado la recepción física del paquete, la
reasignación debe incluir el registro de su devolución o transferencia
al nuevo responsable.

**Una reasignación digital no significa que el paquete haya cambiado
físicamente de manos.** El sistema debe registrar ambos eventos por
separado.

**2.13. Funcionamiento sin internet**

Esta función merece especial atención porque la aplicación se utilizará
en rutas de distribución.

La aplicación debería poder conservar temporalmente ciertas tareas y
permitir registrar eventos cuando no haya conexión, si el dispositivo y
la arquitectura lo permiten.

Pero no todas las operaciones pueden confirmarse sin conexión.

Por ejemplo, el sistema podría permitir guardar una evidencia de entrega
pendiente de sincronización, pero no debería dar por confirmada una
reasignación si no puede verificar que otro repartidor no haya recibido
ya el paquete.

Cuando regrese la conexión, la aplicación debe sincronizar los registros
y resolver los conflictos de forma segura.

El ingeniero tendrá que definir cómo funcionará el modo sin conexión,
qué información se almacenará localmente y cómo se protegerán los datos
del dispositivo. (**si tienes alguna novedad con esta función me lo
haces saber por favor)**

**3. TERCER COMPONENTE: PÁGINA WEB PARA QUE LOS CLIENTES REGISTREN SUS
ENVÍOS**

En la página de la empresa permite que LUCG reciba solicitudes de
servicio sin depender de que un trabajador registre manualmente cada
envío.

La página web no debe ser solamente informativa. Tendrá una sección
comercial y un portal transaccional para los clientes.

Propongo separar estas dos funciones.

**3.1. Página pública de LUCG LOGISTICS**

La página pública presentará la empresa, sus servicios y los canales de
contacto.

Podrá incluir:

-   Inicio.

-   Nosotros.

-   Paquetería y última milla.

-   Almacenamiento e inventario.

-   Transporte y distribución.

-   Servicios de apoyo a operaciones portuarias.

-   Cobertura.

-   Contacto.

-   Acceso de clientes.

-   Seguimiento de envíos.

El objetivo es que una empresa interesada conozca los servicios de LUCG
y pueda solicitar una cotización o registrarse para utilizar la
plataforma.

**3.2. Registro de clientes**

El cliente deberá poder crear una cuenta desde la página web.

El formulario puede solicitar:

-   Nombre de la empresa o persona.

-   Tipo de cliente.

-   NIT o documento de identificación, cuando corresponda.

-   Nombre del contacto autorizado.

-   Correo electrónico.

-   Teléfono.

-   Dirección.

-   Ciudad y departamento.

-   Datos de facturación.

-   Aceptación de los términos y la política de privacidad.

Para clientes empresariales, el sistema podrá exigir aprobación
administrativa antes de permitir la creación de guías.

Esto es importante porque no necesariamente todos los visitantes de la
página tendrán autorización para contratar servicios.

El administrador de LUCG podrá activar, suspender o actualizar la
cuenta.

**3.3. Inicio de sesión del cliente**

Una vez autorizado, el cliente podrá ingresar con sus credenciales.

Su portal mostrará exclusivamente la información que le corresponde.

Por ejemplo:

**Panel del cliente**

-   Crear un envío.

-   Crear varios envíos.

-   Consultar guías.

-   Descargar etiquetas.

-   Consultar el estado de los paquetes.

-   Ver el historial.

-   Descargar reportes.

-   Consultar novedades.

-   Consultar tarifas autorizadas.

-   Ver facturas y saldos, cuando este módulo esté habilitado.

La disponibilidad de cada función dependerá del contrato y de los
permisos asignados.

**3.4. Crear una guía individual**

Este será uno de los procesos principales.

El cliente seleccionará «Crear envío» y completará la información
requerida.

**Datos del remitente**

-   Nombre o empresa.

-   Documento, cuando corresponda.

-   Teléfono.

-   Dirección de remitente: (Que lleven el paquete a las oficinas)

-   Dirección de recogida. Esto de pendiente de la cantidad que se vaya
    a recoger.

-   Municipio y departamento.

-   Correo electrónico, cuando aplique.

**Datos del destinatario**

-   Nombre completo.

-   Teléfono.

-   Dirección de entrega: aparte de colocar la dirección escrita, se
    puede la opción de que puede registrar la ubicación.

-   Municipio y departamento.

-   Barrio o zona.

-   Referencias para localizar el lugar.

-   Instrucciones especiales de entrega.

**Datos del paquete**

-   Contenido declarado.

-   Cantidad de unidades.

-   Peso.

-   Dimensiones, cuando aplique.

-   Valor declarado de la mercancía.

-   Observaciones.

-   Servicio solicitado.

-   Fecha requerida, cuando corresponda.

El sistema debe validar los campos obligatorios y advertir cuando falte
información.

También deberá verificar si el destino se encuentra dentro de la
cobertura autorizada y si el paquete cumple las condiciones del
servicio.

**3.5. Cálculo de la tarifa**

Aquí hay una decisión comercial importante.

El sistema no debe permitir que cualquier persona introduzca libremente
un precio de envío.

La tarifa debe calcularse con las reglas aprobadas por LUCG.

Dependiendo del servicio, se podrán tener en cuenta:

-   Origen.

-   Destino.

-   Zona de cobertura.

-   Peso.

-   Dimensiones o peso volumétrico, si aplica.

-   Tipo de servicio.

-   Número de paquetes.

-   Servicios adicionales.

-   Condiciones comerciales del cliente.

Podemos manejar tarifas diferentes para clientes con contrato y clientes
ocasionales.

**Ejemplo**

Un cliente empresarial tiene una tarifa negociada para envíos entre
Apartadó, Carepa, Chigorodó y Turbo.

Cuando registra un envío, el sistema identifica el cliente, consulta la
tarifa que tiene autorizada y calcula el valor correspondiente.

Si el envío está fuera de cobertura o requiere una tarifa especial, el
sistema puede generar una solicitud de cotización en lugar de aceptar
automáticamente un precio.

**La tarifa que ve el cliente debe ser la misma que utiliza el sistema
para registrar la operación y calcular el cobro**, salvo que exista una
modificación autorizada y documentada.

**3.6. Generación de la guía**

Cuando el cliente complete la información y confirme la solicitud, el
sistema deberá:

1.  Validar los datos.

2.  Calcular o consultar la tarifa.

3.  Verificar las condiciones del servicio.

4.  Registrar la solicitud.

5.  Generar un número único de guía.

6.  Generar el código de barras o QR.

7.  Guardar el registro en la base de datos.

8.  Mostrar la confirmación al cliente.

9.  Permitir descargar o imprimir la etiqueta, según el flujo
    establecido.

10. Habilitar la consulta del envío en el portal.

Sin embargo, debemos definir algo importante: **crear una guía no
significa que LUCG ya haya recibido físicamente el paquete**.

Por eso, el estado inicial podría ser «Guía creada» o «Pendiente de
recogida».

Después, cuando el paquete ingrese físicamente a la operación, cambiará
a «Recibido en bodega» o al estado que corresponda.

Esto evitará confusiones con paquetes que el cliente registró, pero que
todavía no ha entregado.

**3.7. Creación masiva de guías**

Para clientes que manejan decenas o cientos de envíos, crear las guías
una por una sería demasiado lento.

Por eso, seria incluir una función para cargar un archivo Excel o CSV
con varios envíos.

El proceso sería:

1.  El cliente descarga una plantilla.

2.  Completa los datos de los remitentes, destinatarios y paquetes.

3.  Sube el archivo.

4.  El sistema valida los campos.

5.  Identifica filas incompletas o con errores.

6.  Muestra un resumen antes de confirmar.

7.  El cliente corrige los errores.

8.  El sistema crea las guías válidas.

9.  Permite descargar las etiquetas y el reporte de resultados.

El sistema debe evitar crear guías duplicadas si el cliente carga dos
veces el mismo archivo por error.

También debe indicar cuáles registros se crearon y cuáles necesitan
corrección.

**3.8. Seguimiento del envío**

Cada guía tendrá una página de seguimiento.

El cliente podrá consultar los eventos autorizados, por ejemplo:

-   Guía creada.

-   Paquete recibido.

-   En clasificación.

-   Asignado a distribución.

-   En ruta de entrega.

-   Novedad registrada.

-   Entrega reprogramada.

-   Entregado.

Los eventos deben mostrar fechas y horas cuando corresponda.

El seguimiento debe actualizarse automáticamente a medida que se
registran los movimientos en el sistema administrativo y en la
aplicación móvil.

Para las consultas públicas, recomiendo que el número de guía no sea
suficiente para revelar toda la información personal del remitente o del
destinatario.

La página pública debe mostrar solamente los datos necesarios para
informar el estado del envío.

Los datos completos, las fotografías, las firmas y los documentos
deberán estar disponibles únicamente para usuarios autorizados.

**3.9. Evidencia de entrega para el cliente**

Cuando el paquete sea entregado, el cliente autorizado podrá consultar
la información de confirmación.

Según el contrato y los permisos, podría ver:

-   Fecha y hora de entrega.

-   Nombre registrado de quien recibió.

-   Estado final.

-   Evidencias fotográficas autorizadas.

-   Firma, cuando corresponda.

-   Historial del envío.

-   Observaciones relacionadas con la entrega.

Esto permite que el cliente compruebe la gestión del envío sin tener que
comunicarse constantemente con el personal de LUCG.

Las evidencias deben almacenarse de manera segura, con controles de
acceso y una política definida de conservación y eliminación.

**4. LOS TRES COMPONENTES DEBEN ESTAR CONECTADOS**

Esta es una de las decisiones técnicas más importantes de todo el
proyecto.

No queremos construir tres sistemas independientes que luego deban
intercambiar información manualmente.

Queremos **una plataforma central con tres interfaces que utilicen la
misma información y respeten los permisos de cada usuario**.

Observa cómo funcionaría:

**Ejemplo de funcionamiento completo**

Imaginemos que un cliente registra 50 envíos desde la página web.

**Paso 1. Portal del cliente**

El cliente crea las 50 guías.

El sistema registra los envíos y genera sus identificadores.

**Paso 2. Sistema administrativo**

Los 50 envíos aparecen en el panel de LUCG con estado «Guía creada» o
«Pendiente de recepción».

**Paso 3. Recepción en bodega**

Cuando los paquetes llegan físicamente, el personal escanea las guías y
confirma las cantidades recibidas.

**Paso 4. Asignación**

El coordinador selecciona los 50 paquetes y los asigna a un repartidor.

**Paso 5. Aplicación móvil**

Los 50 paquetes aparecen en las tareas del repartidor.

**Paso 6. Verificación física**

El repartidor escanea los paquetes y confirma cuáles recibió realmente.

**Paso 7. Distribución**

Cuando inicia su ruta, el sistema registra el cambio de estado
correspondiente.

**Paso 8. Entrega**

Por cada paquete entregado, el repartidor registra el receptor, la firma
y las evidencias requeridas.

**Paso 9. Actualización**

El sistema administrativo actualiza los indicadores y el portal del
cliente muestra el nuevo estado del envío.

**Paso 10. Cierre operativo**

Los paquetes entregados aparecen en los informes correspondientes,
mientras que las novedades y los paquetes pendientes permanecen
disponibles para su seguimiento.

Todo esto debe suceder sin que un administrativo tenga que volver a
escribir manualmente la información de cada paquete.

**5. INDICADORES DE GESTIÓN PARA LUCG LOGISTICS**

Aquí conectamos el sistema operativo con tu objetivo de aprender
análisis de datos.

No basta con saber cuántos paquetes tenemos. Necesitamos saber qué tan
bien estamos trabajando.

El sistema deberá almacenar los datos necesarios para construir
indicadores confiables.

**5.1. Indicadores por repartidor**

El sistema podrá mostrar:

-   Paquetes asignados.

-   Paquetes recibidos físicamente.

-   Paquetes entregados.

-   Paquetes con novedades.

-   Paquetes pendientes.

-   Entregas realizadas dentro del plazo.

-   Entregas realizadas fuera del plazo.

-   Intentos de entrega.

-   Porcentaje de cumplimiento.

-   Productividad por día.

-   Evidencias pendientes o incompletas.

**Ejemplo**

Un repartidor recibió 50 paquetes y logró entregar 45 durante la
jornada.

Si calculamos la proporción de paquetes entregados sobre los recibidos:

45 ÷ 50 × 100 = **90 % de entrega sobre los paquetes recibidos**.

Pero debemos tener cuidado con la interpretación.

Ese 90 % no significa necesariamente que el repartidor haya cumplido el
90 % de las entregas prometidas. Puede haber recibido paquetes con
direcciones incorrectas, destinatarios ausentes o plazos diferentes.

Por eso recomiendo mostrar varios indicadores:

  -----------------------------------------------------------------------
  **Indicador**        **Fórmula propuesta**
  -------------------- --------------------------------------------------
  Entrega sobre        Paquetes entregados ÷ paquetes recibidos × 100.
  paquetes recibidos   

  Cumplimiento del     Paquetes entregados dentro del plazo ÷ paquetes
  plazo                cuyo plazo de entrega venció durante el periodo ×
                       100.

  Tasa de novedades    Paquetes con novedad ÷ paquetes gestionados × 100.

  Pendientes al cierre Paquetes recibidos que siguen sin resolución al
                       cierre de la jornada.
  -----------------------------------------------------------------------

Para evitar resultados engañosos, el sistema debe definir si las
métricas se calculan por fecha de asignación, fecha de recepción, fecha
de entrega o fecha límite.

También debemos definir cómo se cuentan las entregas parciales, las
reasignaciones y los paquetes que siguen dentro del plazo.

**5.2. Indicadores generales de la empresa**

El tablero gerencial debería mostrar:

-   Total de guías creadas.

-   Paquetes recibidos.

-   Paquetes entregados.

-   Porcentaje de cumplimiento.

-   Entregas a tiempo.

-   Novedades por categoría.

-   Paquetes pendientes.

-   Rendimiento por municipio.

-   Rendimiento por repartidor.

-   Rendimiento por cliente.

-   Costos por paquete.

-   Ingresos por servicio.

-   Rentabilidad por cliente y servicio.

Los indicadores financieros deberán conectarse con los registros de
tarifas, costos y facturación.

**No debemos confundir el valor declarado de la mercancía con los
ingresos de LUCG.** El valor de la mercancía pertenece al registro del
envío; el ingreso de LUCG corresponde al servicio que presta y factura.

**6. FUNCIONES ADICIONALES QUE NO DEBEMOS OLVIDAR**

Tu descripción está muy completa para iniciar el diseño, pero hay
algunos aspectos que recomiendo definir desde el comienzo.

**A. Notificaciones automáticas**

El sistema podría enviar avisos cuando:

-   Se crea una guía.

-   Un paquete es recibido.

-   Un envío está próximo a vencer.

-   Se registra una novedad.

-   Se completa una entrega.

-   Hay paquetes pendientes de gestionar.

Podemos evaluar notificaciones por correo electrónico, WhatsApp u otros
canales, teniendo en cuenta los costos, las autorizaciones y las
integraciones necesarias.

**B. Seguridad de la información**

Debemos contemplar:

-   Acceso mediante credenciales.

-   Permisos por perfil.

-   Protección de contraseñas.

-   Registro de actividades.

-   Copias de seguridad.

-   Protección de fotografías y firmas.

-   Recuperación de contraseñas.

-   Cierre de sesiones.

-   Gestión de usuarios inactivos.

-   Políticas de conservación de la información.

**C. Historial y auditoría**

No se deben eliminar sin control los registros de una entrega, una
reasignación o una novedad.

Si se necesita corregir información, el sistema debe registrar quién
realizó la corrección, cuándo y por qué.

**D. Reportes descargables**

Los usuarios autorizados podrán descargar informes de:

-   Guías.

-   Inventario.

-   Entregas.

-   Novedades.

-   Repartidores.

-   Vehículos.

-   Tiempos de entrega.

-   Costos.

-   Facturación.

Los informes deberán respetar los filtros y permisos de cada usuario.

**E. Integración futura con otros servicios**

Aunque inicialmente nos concentremos en paquetería y última milla,
recomiendo que la arquitectura permita incorporar módulos independientes
de:

-   Almacenamiento e inventario.

-   Transporte.

-   Operaciones portuarias.

-   Facturación y cartera.

-   Portal empresarial.

-   Indicadores avanzados.

No necesitamos desarrollar todos estos módulos de inmediato. Lo
importante es que el diseño no nos obligue a reconstruir todo el sistema
cuando LUCG crezca.

**7. CÓMO RECOMIENDO DESARROLLAR EL PROYECTO**

La creación de puede dividir de la siguiente manera.

Lo dividiría en fases.

  -----------------------------------------------------------------------------
  **Fase**   **Desarrollo**                           **Resultado esperado**
  ---------- ---------------------------------------- -------------------------
  1          Diseño de procesos, base de datos,       Estructura sólida del
             usuarios y permisos                      sistema.

  2          Sistema administrativo de guías,         Control operativo
             paquetes, estados, bodega y asignaciones centralizado.

  3          Aplicación móvil para escaneo, entregas, Gestión de la última
             evidencias y novedades                   milla.

  4          Portal de clientes para crear guías y    Autoservicio para los
             consultar envíos                         clientes.

  5          Indicadores, alertas y reportes          Control del cumplimiento
                                                      y productividad.

  6          Integraciones, mejoras y módulos         Plataforma preparada para
             logísticos adicionales                   crecer.
  -----------------------------------------------------------------------------

El orden puede ajustarse según la necesidad comercial, pero hay una
condición: debemos definir desde el principio cómo se conectarán los
componentes, aunque se construyan en diferentes etapas.

**Antes de programar, hay que definir**

1.  Qué pantallas tendrá cada componente.

2.  Qué datos debe guardar cada pantalla.

3.  Qué usuario puede consultar o modificar cada dato.

4.  Qué estados puede tener un paquete.

5.  Qué acciones provocan un cambio de estado.

6.  Qué validaciones impiden errores.

7.  Cómo se comunicarán el sistema administrativo, la aplicación y el
    portal.

8.  Cómo se manejarán los registros duplicados.

9.  Cómo se protegerán las fotografías, firmas y datos personales.

10. Cómo se probará cada función antes de habilitarla.

También deberá proponer la tecnología, la base de datos, el alojamiento,
las medidas de seguridad y el plan de mantenimiento. Estas decisiones
deben responder a los requisitos reales y al presupuesto disponible, no
a preferencias tecnológicas aisladas.

**8. DOCUMENTO DE REQUERIMIENTOS PARA ENTREGARLE AL INGENIERO**

Requerimientos funcionales de la plataforma logística LUCG LOGISTICS

**PROYECTO: DESARROLLO DE PLATAFORMA LOGÍSTICA INTEGRAL PARA LUCG
LOGISTICS**

**1. Objetivo del proyecto**

Desarrollar una plataforma tecnológica para administrar y controlar los
procesos de paquetería y última milla de LUCG LOGISTICS, conectando el
sistema administrativo, la aplicación móvil de los repartidores y el
portal web de los clientes.

La plataforma debe permitir la trazabilidad de cada envío desde la
creación de la guía hasta la entrega final, incluyendo recepción en
bodega, asignación, distribución, evidencias, novedades, indicadores y
reportes.

**2. Componentes principales**

**2.1. Sistema administrativo general**

Debe permitir:

-   Crear, editar, activar y desactivar usuarios.

-   Administrar perfiles y permisos.

-   Registrar clientes y repartidores.

-   Registrar vehículos y asociarlos a las operaciones.

-   Consultar y administrar las guías.

-   Registrar la recepción física de los paquetes.

-   Controlar el inventario de bodega.

-   Clasificar y asignar paquetes.

-   Registrar la entrega física de paquetes a los repartidores.

-   Consultar los paquetes asignados, recibidos, en ruta, entregados,
    pendientes y con novedades.

-   Configurar alertas por vencimiento de los plazos de entrega.

-   Administrar las novedades.

-   Autorizar reasignaciones.

-   Consultar las evidencias de entrega.

-   Consultar el historial de cada paquete.

-   Descargar informes en formatos autorizados.

-   Visualizar indicadores operativos y gerenciales.

-   Consultar el historial de actividades de los usuarios.

**2.2. Aplicación móvil del repartidor**

Debe permitir:

-   Iniciar y cerrar sesión de manera segura.

-   Consultar las tareas asignadas.

-   Consultar la información necesaria del destinatario.

-   Acceder a las funciones autorizadas de llamada, WhatsApp y
    ubicación.

-   Escanear los paquetes recibidos desde la bodega.

-   Identificar diferencias entre paquetes asignados y paquetes
    recibidos.

-   Consultar las tareas de entrega.

-   Escanear una guía para iniciar la gestión de entrega.

-   Registrar quién recibió el paquete.

-   Registrar el nombre del receptor cuando sea diferente del
    destinatario.

-   Capturar la firma del receptor cuando corresponda.

-   Registrar las evidencias fotográficas exigidas.

-   Validar los campos obligatorios antes de confirmar una entrega.

-   Confirmar entregas y actualizar los estados.

-   Consultar los paquetes entregados.

-   Consultar el historial autorizado.

-   Reportar novedades y adjuntar evidencias.

-   Consultar los problemas reportados.

-   Gestionar reasignaciones autorizadas.

-   Registrar transferencias físicas entre responsables.

-   Manejar interrupciones de conectividad de forma segura.

-   Sincronizar los eventos pendientes cuando se recupere la conexión.

**2.3. Portal web para clientes**

Debe permitir:

-   Registrar clientes.

-   Aprobar y administrar cuentas empresariales.

-   Iniciar y recuperar sesiones de acceso.

-   Crear guías individuales.

-   Crear guías masivas mediante archivos Excel o CSV.

-   Validar los datos de remitentes, destinatarios y paquetes.

-   Consultar las tarifas autorizadas.

-   Calcular el precio del servicio según las reglas comerciales.

-   Generar números únicos de guía.

-   Generar códigos de barras o QR.

-   Descargar etiquetas.

-   Consultar el estado de los envíos.

-   Consultar el historial de seguimiento.

-   Consultar las evidencias de entrega autorizadas.

-   Descargar reportes.

-   Consultar novedades.

-   Consultar información comercial y de facturación cuando el módulo
    esté habilitado.

**3. Trazabilidad y estados**

Cada paquete debe contar con un identificador único y un historial
cronológico de eventos.

Los estados deben diferenciar la creación de la guía, la recepción
física, la clasificación, la asignación, la entrega al repartidor, la
salida a ruta, la entrega final, las novedades, las devoluciones y las
demás situaciones definidas para la operación.

El sistema debe impedir cambios de estado incompatibles, entregas
duplicadas y reasignaciones no autorizadas.

Cada evento debe registrar la fecha y hora, el usuario responsable, el
estado anterior cuando corresponda y la acción realizada.

**4. Indicadores**

El sistema debe permitir calcular, como mínimo:

-   Paquetes recibidos.

-   Paquetes asignados.

-   Paquetes entregados.

-   Paquetes pendientes.

-   Paquetes con novedades.

-   Porcentaje de entrega sobre paquetes recibidos.

-   Cumplimiento de los plazos de entrega.

-   Productividad por repartidor.

-   Novedades por categoría.

-   Resultados por cliente y municipio.

-   Costos por paquete.

-   Ingresos por servicio.

-   Rentabilidad por cliente y servicio, cuando estén disponibles los
    datos financieros necesarios.

Las fórmulas, periodos y criterios de cálculo deben documentarse y ser
consistentes en todos los reportes.

**5. Seguridad y protección de la información**

La plataforma debe implementar:

-   Autenticación de usuarios.

-   Permisos por perfil.

-   Separación de la información de cada cliente.

-   Protección de credenciales.

-   Registro de actividades.

-   Copias de seguridad.

-   Protección de fotografías, firmas y documentos.

-   Políticas de acceso, conservación y eliminación de datos.

-   Controles contra accesos y modificaciones no autorizados.

**6. Requisitos técnicos y de calidad**

Se deberá proponer y documentar:

-   Arquitectura general.

-   Tecnología de desarrollo.

-   Base de datos.

-   Integración entre los tres componentes.

-   Infraestructura de alojamiento.

-   Seguridad y recuperación de información.

-   Estrategia de sincronización de la aplicación móvil.

-   Manejo de errores y registros duplicados.

-   Pruebas funcionales y de seguridad.

-   Plan de mantenimiento.

-   Documentación técnica.

-   Procedimiento de entrega y administración del código fuente

**7. Metodología de desarrollo**

El proyecto debe desarrollarse por fases, con entregables definidos y
pruebas de aceptación antes de avanzar.

Cada módulo deberá contar con una descripción funcional, pantallas
acordadas, reglas de negocio, permisos y criterios para verificar su
correcto funcionamiento.

Los cambios posteriores al alcance aprobado deberán documentarse y
evaluarse antes de incorporarse al desarrollo.

**8. Propiedad y continuidad**

Se deberá acordar por escrito la titularidad del código fuente, la base
de datos, el dominio, las cuentas de infraestructura y los demás activos
del proyecto.

LUCG LOGISTICS debe conservar acceso administrativo a sus activos y
disponer de documentación suficiente para garantizar la continuidad del
sistema.

**9. Resultado esperado**

Una plataforma centralizada, segura, trazable y escalable que permita
gestionar la paquetería y la última milla de LUCG LOGISTICS, facilite el
trabajo del personal operativo, mejore el servicio al cliente y
proporcione información confiable para la toma de decisiones
gerenciales.

**9. Hay cuatro decisiones que debemos resolver o debemos de tener en
cuenta.**

El documento anterior constituye una buena base, pero todavía
necesitamos definir algunos aspectos antes de convertirlo en una
especificación definitiva.

**1. ¿Quiénes podrán crear las guías?**

-   Solo los clientes empresariales autorizados.

-   Cualquier persona que se registre en la página.

-   Ambas opciones, con tarifas y condiciones diferentes.

**2. ¿Cómo se realizará el cobro?**

-   El cliente tendrá una tarifa negociada y recibirá una factura
    periódica.

-   El cliente pagará cada envío al crear la guía.

-   LUCG manejará ambas modalidades.

**3. ¿Qué tipo de aplicación móvil desarrollarán?**

-   Una aplicación para instalar desde las tiendas de aplicaciones.

-   Una aplicación web que funcione desde el navegador del celular.

-   El ingeniero deberá evaluar ambas alternativas según las necesidades
    de escaneo, cámara, firma, funcionamiento sin conexión y
    presupuesto.

**4. ¿Cómo funcionará la asignación de paquetes?**

-   Solo el administrador asigna los paquetes.

-   El administrador asigna, pero el repartidor puede solicitar que otro
    compañero los reciba.

-   Se permite la reasignación entre repartidores, con autorización y
    trazabilidad.

Mi recomendación inicial es permitir que el cliente empresarial cree
guías, que LUCG pueda manejar tarifas negociadas y pagos por envío o
facturación periódica, y que las reasignaciones queden sujetas a reglas
claras de autorización y transferencia física.

**MÓDULO ADMINISTRATIVO, FINANCIERO Y DE RENTABILIDAD**

LUCG LOGISTICS debe diseñarse para trabajar con **ambas modalidades de
negocio**, y eso es muy importante porque el sistema debe diferenciar de
dónde provienen los ingresos, quién paga el servicio y cuáles son los
costos que asume LUCG.

Te explico cómo lo organizaría si estuviera diseñando la plataforma para
mi propia empresa. La idea es que, cuando el sistema esté funcionando,
puedas responder preguntas como estas:

-   ¿Cuánto dinero está generando LUCG cada mes?

-   ¿Qué cliente nos está dejando más ganancias?

-   ¿Cuánto nos cuesta entregar un paquete?

-   ¿Cuánto pagamos por transportar los paquetes desde Medellín hasta
    Urabá?

-   ¿Qué municipios son más rentables?

-   ¿Cuánto debemos cobrar para no perder dinero?

-   ¿Cuánto nos deben los clientes y cuánto debemos a nuestros
    proveedores?

-   ¿Tenemos ganancias reales o simplemente estamos moviendo dinero?

**1. Las dos modalidades de negocio**

**Modalidad 1. Distribución de paquetes para otras empresas**

En este modelo, LUCG recibe paquetes de una empresa transportadora o de
mensajería y se encarga de distribuirlos hasta el destinatario final.

**Ejemplo:**

Una empresa de mensajería contrata a LUCG para entregar paquetes en
Apartadó, Carepa, Chigorodó y Turbo.

  -----------------------------------------------------------------------
  **Concepto**                                   **Ejemplo**
  ---------------------------------------------- ------------------------
  Empresa cliente                                Empresa de mensajería A

  Paquetes entregados durante el mes             2.000

  Tarifa que paga el cliente por paquete         \$3.000
  entregado                                      

  Ingreso generado por las entregas              \$6.000.000
  -----------------------------------------------------------------------

Sin embargo, esos \$6.000.000 no son ganancias netas. LUCG debe pagar al
personal de distribución, el transporte entre municipios, los gastos
operativos y los demás costos correspondientes.

El sistema debe calcular cuánto dinero queda después de descontar esos
costos.

**Algo importante:** también debemos registrar los paquetes que
recibimos, pero que todavía no hemos entregado. Así podremos distinguir
entre paquetes recibidos, entregados, pendientes, devueltos y
facturables, según lo acordado con cada cliente.

**Modalidad 2. Envíos contratados directamente por los clientes**

En este modelo, una empresa o una persona contrata directamente a LUCG
para enviar un paquete a otro municipio.

**Ejemplo:**

Una empresa de Apartadó necesita enviar 100 paquetes a Medellín.

  -----------------------------------------------------------------------
  **Concepto**                                        **Ejemplo**
  --------------------------------------------------- -------------------
  Cliente que contrata el servicio                    Empresa B

  Cantidad de paquetes enviados                       100

  Tarifa de venta por paquete                         \$12.000

  Valor total del servicio                            \$1.200.000
  -----------------------------------------------------------------------

Pero LUCG debe pagar el transporte, la distribución y los demás
servicios necesarios para cumplir con el envío.

Por ejemplo, si los costos asociados a esos 100 envíos suman \$800.000,
la diferencia sería de \$400.000 antes de descontar otros gastos que
todavía no estén incluidos.

El sistema debe permitir identificar claramente el ingreso, los costos y
el resultado de esta operación.

**La diferencia fundamental:** en la primera modalidad, normalmente nos
pagan por distribuir paquetes de otra empresa; en la segunda, LUCG vende
directamente el servicio de envío y debe administrar la tarifa que cobra
al remitente y los costos necesarios para cumplirlo.

**2. Así organizaría el sistema administrativo y financiero**

Organizar el sistema en módulos conectados entre sí, para evitar que
tengas que registrar la misma información varias veces.

**Módulo 1. Clientes y contratos**

Aquí registraríamos a todas las empresas y personas que contratan
nuestros servicios.

Cada cliente tendría una ficha con:

-   Nombre o razón social.

-   NIT o identificación.

-   Datos de contacto.

-   Modalidad de servicio contratada.

-   Tarifas acordadas.

-   Municipios y zonas de cobertura.

-   Frecuencia de facturación.

-   Plazos de pago.

-   Servicios adicionales contratados.

-   Contrato, condiciones comerciales y observaciones.

El sistema debe permitir que un mismo cliente contrate diferentes
servicios, cada uno con sus propias tarifas y condiciones.

**Módulo 2. Tarifas de venta**

Este módulo permitirá establecer cuánto cobramos por cada servicio.

Por ejemplo:

  ------------------------------------------------------------------------
  **Servicio**                   **Unidad de cobro**       **Tarifa
                                                           ilustrativa**
  ------------------------------ ------------------------- ---------------
  Distribución para otra         Paquete entregado y       \$3.000
  transportadora                 facturable                

  Envío contratado directamente  Paquete enviado           \$12.000

  Almacenamiento                 Estiba por mes            Según contrato

  Alistamiento de mercancía      Unidad, pedido o estiba   Según servicio

  Transporte entre municipios    Viaje o unidad acordada   Según ruta
  ------------------------------------------------------------------------

Estos valores son ejemplos, no tarifas recomendadas definitivas.

**La tarifa no debe ser única para todos los clientes.** El sistema debe
permitir negociar precios diferentes según el cliente, municipio, zona,
tipo de paquete, peso, volumen, cantidad y condiciones del contrato.

También debe guardar el historial de tarifas, para que una modificación
no cambie retroactivamente el precio de los servicios realizados
anteriormente.

**Módulo 3. Costos de transporte y distribución**

Este módulo será fundamental porque LUCG actualmente contrata
proveedores externos para transportar los paquetes.

Debe registrar:

-   Proveedor de transporte.

-   Municipio de origen y destino.

-   Fecha del servicio.

-   Cantidad de paquetes transportados.

-   Tipo de vehículo.

-   Valor del viaje.

-   Servicios adicionales.

-   Factura o cuenta de cobro del proveedor.

-   Estado de pago.

-   Clientes y envíos relacionados con el costo.

Por ejemplo, si contratamos un vehículo para llevar 300 paquetes de
Medellín a Urabá por \$900.000, el sistema debe registrar el costo del
viaje y permitir distribuirlo entre los envíos correspondientes.

Pero hay un detalle importante: **el sistema no debe asumir que todos
los paquetes cuestan lo mismo de transportar**. Dependiendo del acuerdo
con el proveedor, el costo puede distribuirse por paquete, peso,
volumen, espacio ocupado o una combinación de criterios.

Si varios clientes comparten un mismo vehículo, debemos definir cómo se
reparte el costo entre ellos.

**Módulo 4. Costos del personal operativo**

Aquí registraríamos los costos asociados al personal que participa en la
operación:

-   Domiciliarios.

-   Auxiliares de bodega.

-   Personal de recepción y despacho.

-   Coordinadores operativos.

-   Personal administrativo.

Para cada trabajador o contratista, el sistema debe permitir registrar
los costos que correspondan a su modalidad de vinculación.

También debemos distinguir entre:

-   **Costo fijo de personal:** salario, prestaciones, aportes y demás
    conceptos que correspondan.

-   **Costo variable:** pago por paquete, entrega, ruta o servicio,
    cuando aplique.

Por ejemplo, si un domiciliario recibe un pago mensual, ese costo no
debe registrarse nuevamente como un gasto adicional por cada paquete. El
costo por paquete se calcula como un indicador para analizar la
productividad y rentabilidad.

**Módulo 5. Gastos administrativos y operativos**

Aquí registraremos los gastos necesarios para mantener funcionando LUCG.

Con base en las cifras que habíamos considerado anteriormente, podríamos
comenzar con estas categorías y actualizar los valores cuando
confirmemos los costos actuales:

  -----------------------------------------------------------------------
  **Gasto**                              **Valor mensual ilustrativo**
  -------------------------------------- --------------------------------
  Arrendamiento de bodega                \$4.000.000

  Servicios públicos                     \$400.000

  Papelería e insumos                    \$500.000

  Imprevistos presupuestados             \$500.000

  Personal                               Según costo real y clasificación

  Internet y telefonía                   Por definir

  Software y herramientas tecnológicas   Por definir

  Mantenimiento y reparaciones           Según necesidad

  Otros gastos                           Según operación
  -----------------------------------------------------------------------

Debemos evitar contar dos veces el personal, porque sus costos se
registrarían en el módulo correspondiente.

También recomiendo que el sistema diferencie los **gastos realmente
incurridos** de los presupuestos. Por ejemplo, reservar \$500.000 para
imprevistos no significa que ya hayamos gastado ese dinero.

**Módulo 6. Facturación y cuentas por cobrar**

Este módulo debe permitir saber qué servicios hemos facturado y cuánto
dinero nos deben.

Necesitamos registrar:

-   Cliente.

-   Servicios prestados.

-   Período facturado.

-   Cantidad de paquetes facturables.

-   Valor unitario.

-   Descuentos autorizados.

-   Impuestos aplicables.

-   Total de la factura.

-   Fecha de emisión y vencimiento.

-   Abonos recibidos.

-   Saldo pendiente.

-   Estado de pago.

Para la modalidad de distribución, debemos configurar qué eventos
permiten facturar. Por ejemplo, si el contrato establece que se cobra
por paquete entregado, el sistema no debe incluir automáticamente
paquetes que continúan pendientes.

Para los envíos contratados directamente, debe establecerse si se
factura al crear el envío, al recibirlo, al despacharlo, al entregarlo o
según el acuerdo comercial.

**Importante:** el módulo puede controlar la información comercial y las
cuentas por cobrar, pero la expedición de facturas electrónicas debe
integrarse con una solución que cumpla los requisitos aplicables en
Colombia, con validación contable.

**Módulo 7. Cuentas por pagar**

Aquí veremos cuánto debemos a los proveedores.

Por ejemplo:

-   Transportadores.

-   Proveedores de vehículos.

-   Contratistas.

-   Proveedores de insumos.

-   Arrendador.

-   Servicios públicos.

-   Otros proveedores.

Cada registro debe indicar el concepto, el valor, la fecha de
vencimiento, el soporte, el estado y la fecha de pago.

Esto permitirá saber no solamente cuánto hemos gastado, sino también
cuánto dinero necesitamos para cumplir con las obligaciones próximas.

**Módulo 8. Rentabilidad de LUCG**

Este sería uno de los módulos más importante.

El sistema debe mostrar la rentabilidad por:

-   Cliente.

-   Servicio.

-   Municipio.

-   Ruta.

-   Período.

-   Modalidad de negocio.

Por ejemplo:

  ------------------------------------------------------------------------
  **Concepto**               **Modalidad 1:        **Modalidad 2: envíos
                             distribución**        directos**
  -------------------------- --------------------- -----------------------
  Ingresos por servicios     \$6.000.000           \$1.200.000

  Costos directos            \$3.500.000           \$800.000

  Margen después de costos   \$2.500.000           \$400.000
  directos                                         

  Gastos generales asignados \$1.000.000           \$150.000

  Resultado operativo        \$1.500.000           \$250.000
  estimado                                         
  ------------------------------------------------------------------------

*Ejemplo ficticio para explicar la estructura. Los costos, la
distribución de gastos y los impuestos deben definirse con datos
reales.*

En este ejemplo, ambas modalidades generan un resultado operativo
positivo. Sin embargo, la modalidad de distribución genera \$1.500.000,
mientras que los envíos directos generan \$250.000.

Esto no significa que la primera modalidad siempre sea más rentable.
Tendremos que comparar volúmenes, tarifas, costos, tiempos y
obligaciones reales.

Además, si los gastos generales se distribuyen entre ambas modalidades,
el sistema debe evitar duplicarlos.

**3. El tablero de resultados**

Es ingresar al sistema y encuentras una pantalla con los resultados del
mes.

**Indicadores principales:**

  -----------------------------------------------------------------------
  **Indicador**              **¿Qué te permite conocer?**
  -------------------------- --------------------------------------------
  Ingresos facturados        Cuánto hemos facturado

  Recaudo                    Cuánto dinero hemos recibido

  Cuentas por cobrar         Cuánto nos deben los clientes

  Cuentas por pagar          Cuánto debemos a los proveedores

  Costos operativos          Cuánto cuesta prestar los servicios

  Gastos administrativos     Cuánto cuesta mantener funcionando la
                             empresa

  Resultado operativo        Si la operación está generando ganancias o
  estimado                   pérdidas

  Costo por paquete          Cuánto cuesta, en promedio, cada entrega
  entregado                  

  Ingreso por paquete        Cuánto generamos por cada paquete facturable
  facturable                 

  Margen por cliente         Qué clientes aportan mayor rentabilidad

  Margen por municipio       Qué municipios generan mejores resultados

  Paquetes pendientes        Cuánta mercancía continúa en proceso
  -----------------------------------------------------------------------

También incluiría alertas como:

-   Clientes con facturas vencidas.

-   Proveedores próximos a vencimiento.

-   Servicios realizados que todavía no se han facturado.

-   Paquetes entregados que necesitan validación para facturación.

-   Rutas con costos superiores a los presupuestados.

-   Clientes o servicios con márgenes negativos.

**Una aclaración contable importante:** la utilidad y el dinero
disponible en el banco no son lo mismo. Puedes tener una operación
rentable y, al mismo tiempo, sufrir falta de efectivo porque tus
clientes todavía no han pagado.

Por eso necesitamos consultar tanto la rentabilidad como el flujo de
caja.

**4. Cómo debe funcionar todo junto**

Te pongo un ejemplo de la conexión que debería existir entre los
módulos.

Supongamos que una empresa contrata a LUCG para distribuir 500 paquetes.

1.  El cliente y su tarifa están registrados en el sistema.

2.  Se reciben los paquetes y se registran sus guías.

3.  Los paquetes se clasifican y asignan a las rutas correspondientes.

4.  Los domiciliarios registran las entregas y las novedades.

5.  El sistema identifica los paquetes que cumplen las condiciones para
    ser facturados.

6.  Se registran los costos de transporte, personal y otros servicios.

7.  Se genera la información para facturación.

8.  Se registra la factura emitida al cliente.

9.  Cuando el cliente paga, se registra el recaudo.

10. El tablero financiero actualiza los indicadores de ingresos, costos,
    cartera y rentabilidad.

Así no tendrías que reconstruir la operación manualmente al final de
cada mes.

El mismo principio aplicaría para los envíos que contraten directamente
los clientes.

**5. Mi recomendación**

Es construir **plataforma administrativa, operativa y financiera
integrada**.

El sistema propio de LUCG debe controlar las operaciones, los precios,
los costos, la facturación comercial, la cartera, los pagos y la
rentabilidad. Para la contabilidad formal, los impuestos, los registros
contables y las obligaciones correspondientes, conviene evaluar la
integración con un software contable adecuado, junto con el contador de
la empresa.

Esto evitará desarrollar dos veces las mismas funciones y facilitará el
crecimiento de LUCG.
