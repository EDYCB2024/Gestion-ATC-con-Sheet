export const ASSISTANT_KNOWLEDGE = `
# MANUAL DE PROCEDIMIENTOS TÉCNICOS POS V5

Este manual contiene los procedimientos para la resolución de fallas, configuración y mantenimiento de terminales POS.

## MODELOS CUBIERTOS
- N950 (Credicard/Platco)
- N910 (Credicard/Platco)
- N750 (Platco)
- ME60
- SP600
- ME51

---

## N910 CREDICARD
1. PROCEDIMIENTO PARA DESCARGAR PARÁMETROS TMS EN N910 CREDICARD
   1. Ingrese a FUNCIONES.
   2. Acceda a Configuración de sistema.
   3. Ingrese la clave 123456.
   4. Ejecute Descargar parámetros TMS.

2. PROCEDIMIENTO PARA LIMPIAR ADVICE, ETIQUETAS Y/O REVERSOS EN N910 CREDICARD
   1. Acceda a FUNCIONES.
   2. Vaya a Configuración de sistema.
   3. Clave 123456.
   4. Seleccione la opción a Ejecutar.
   5. Clave 88888888 (8 veces 8).

## N910 PLATCO
1. PROCEDIMIENTO PARA DESCARGAR PARÁMETROS TMS EN N910 PLATCO.
   1. Ingrese a FUNCIONES.
   2. Acceda a Configuración de sistema.
   3. Ingrese la clave 211117.
   4. Ejecute Descargar parámetros TMS.

---

## ME60
1. CAMBIO DE RED A 3G (MOVISTAR):
   1. Presione la tecla Menú (X).
   2. Seleccione Opción 7: Comunicaciones.
   3. Seleccione Opción 4: Tipo de red.
   4. Elija SIM 2.
   5. Seleccione 3G.

2. CAMBIO DE RED A 3G (DIGITEL):
   1. Presione la tecla Menú (X).
   2. Seleccione Opción 7: Comunicaciones.
   3. Seleccione Opción 4: Tipo de red.
   4. Elija SIM 1.
   5. Seleccione 3G.

3. CAMBIO DE RED A GPRS (DIGITEL):
   1. Tecla Menú (X) -> Opción 7: Comunicaciones.
   2. Configure Tipo com 2 = ninguno.
   3. Configure Tipo com 1 = GPRS.
   4. Seleccione Opción 3: Modo sim = Modo sim 1.

4. CAMBIO DE RED A GPRS (MOVISTAR):
   1. Tecla Menú (X) -> Opción 7: Comunicaciones.
   2. Configure Tipo com 2 = ninguno.
   3. Configure Tipo com 1 = GPRS.
   4. Seleccione Opción 3: Modo sim = Modo sim 2.

5. VER LLAVES EN ME60:
   1. Presione tecla asterisco (*) (Menú Técnico).
   2. Presione teclas 0 y 2 rápido y consecutivo.

6. INICIALIZAR ME60:
   1. Tecla roja (X) (Menú) -> Opción 8: Sistema -> Opción 1: Inicializar.

7. CONFIGURACIÓN WIFI EN ME60:
   1. Tecla (*) Menú Técnico -> Opción 2: Comunicaciones -> Opción 5: WIFI.
   2. Utiliza SSL = 0.NO.
   3. SSID -> Opción 0: BUSCAR -> Elegir red y poner clave.
   4. OPEN DHCP = 1.SI.
   5. Host 1: 201.222.13.4 (4541) / Host 2: 201.222.14.22 (4541).

8. REFRESCAR NII/TPDU EN ME60:
   1. Tecla (*) Menú Técnico -> Comunicaciones -> NII/TPDU.
   2. Pulsar Enter hasta volver. Apagar y prender.

---

## MODELOS SP600 Y ME51 (VER LLAVES)
1. Presione asterisco (*) + tecla verde + número 8.
2. Ingrese clave 88888888.

---

## PARÁMETROS APN (GPRS SIM CARD)
- Credicard Digitel: tdd1.vatc / IP: 200.109.231.231 (4455)
- Credicard Movistar: m2mcredi.movistar.ve / IP: 200.109.231.231 (4455) o 137.1.1.11 (5020)
- Platco Digitel: tdd1.platco2 / IP: 10.0.16.174 (4541)
- Platco Movistar: m2mplatco.movistar.ve / IP: 172.20.100.174 (4541)

---

## EQUIPOS CON TAMPER
- Problemas: Caídas, agua, pilas agotadas, destapado.
- Solución: Deben ingresar obligatoriamente al taller de servicio técnico.
`;
