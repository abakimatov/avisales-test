### Тестовое задание для компании Aviasales

Потыкать вживую можно [здесь](https://avisales-test.vercel.app/).

---

#### Локальная работа с проектом

* ``git clone https://github.com/abakimatov/avisales-test.git``
* ``cd avisales-test``
* ``yarn install``
* ``yarn start``

#### P.S.

Касательно метода фильтрации. В тестовом не было точного описания как должна происходить фильтрация при учете, что в билете у нас 2 направления. Поэтому я сделал так как на основной поисковой странице aviasales. Когда, к примеру, при выбранном варианте `2 остановки` - результатом фильтрации будут как билеты в которых 2 пересадки так и пересадок нет. Как я понимаю отсутствие пересадок в любом случае наиболее желательный результат дл клиента и он допустим во всех выдачах.
