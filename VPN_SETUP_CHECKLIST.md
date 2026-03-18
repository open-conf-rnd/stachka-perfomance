# VPN Setup Checklist (Mac + FoXray + Xray)

## Рабочая настройка

- [ ] Сервер живой: `docker ps` показывает `amnezia-xray` в `Up`, порт `443/tcp` открыт.
- [ ] UUID клиента задан: в `server.json` есть актуальный `id` (UUID).
- [ ] REALITY-параметры совпадают: `serverName`, `publicKey (pbk)`, `shortId (sid)` одинаковы на сервере и в клиенте.
- [ ] FoXray профиль создан: `vless + reality`, `network=raw(tcp)`, `flow=xtls-rprx-vision`, `fingerprint=chrome`.
- [ ] Опции не ломают старт: `mux OFF`, `fragment OFF`, `tcpFastOpen OFF` (базовый режим).
- [ ] Профиль активирован: в FoXray профиль включен, `Real Ping` дает ответ.
- [ ] IP реально меняется: `curl -4 https://ifconfig.me` -> `38.100.139.39`.
- [ ] Гео подтверждается: `curl -s https://ipinfo.io/country` -> `NL`.
- [ ] Конфликтов нет: выключены/удалены лишние VPN-клиенты и фильтры (`v2RayTun`, старые профили, лишние прокси).
- [ ] Бэкап сохранен: рабочая `vless://...` ссылка и параметры (`UUID/pbk/sid/SNI`) сохранены.

## Быстрая диагностика (если снова проблемы)

- [ ] `curl` не меняет IP -> проверить, активен ли профиль и правильный ли `UUID`.
- [ ] Есть ping, но сайты долго грузятся -> проверить `fingerprint=chrome`, затем (при необходимости) включить только `tcpNoDelay`.
- [ ] Вообще не коннектится -> перепроверить `serverName/pbk/sid` (один символ ошибки ломает REALITY).
- [ ] После правок на сервере -> `docker restart amnezia-xray`.

## Команды проверки

```bash
curl -4 https://ifconfig.me
curl -s https://ipinfo.io/country
```
