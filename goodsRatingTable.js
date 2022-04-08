import eventsBus from "./eventsBus.js";

import goodsRatingTableColumns from './goodsRatingTableColumns.js';

import data from './data.js';

export default {
    template: `
        <div>
            <webix-ui :config="webixUIConfig" :value="data.goods"/>
        </div>
    `,

    data() {
        let thisVueCompRef = this;

        return {
            data: data,
            filteredGoods: {},
            favorites: {},
            filters: {
                searchText: '',
                favoritesOnly: false
            },

            webixUIConfig: {
                view: 'datatable',
                id: 'goodsRatingTableWebixCtrl',
                css: "webix_header_border",
                autoConfig: true,
                autoheight:true,
                scrollX: false,
                select: 'row',
                dragColumn: true,
                tooltip: this.tipsRender,
                resizeColumn: { size: 6 },
                columns: goodsRatingTableColumns.getColumns(),
                onClick:{
                    'good-favorite-icon': function(event, cell, target){
                        thisVueCompRef.favorites[thisVueCompRef.data.goods[cell.row - 1].id] = !thisVueCompRef.favorites[thisVueCompRef.data.goods[cell.row - 1].id];
                        localStorage.setItem('favorites', JSON.stringify(thisVueCompRef.favorites));
                        this.render();
                    }
                }
            }
        }
    },

    created: function () {
        goodsRatingTableColumns.init(this);

        this.favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        this.data.goods.forEach(good => {
            if (this.favorites[good.id] == null)
                this.favorites[good.id] = false;
        });

        eventsBus.$on('searchTextChanged', this.searchTextOnChanged);
        eventsBus.$on('favoritesOnlyChanged', this.favoritesOnlyChanged);
        eventsBus.$on('columnShowChange', this.columnShowChange);
        eventsBus.$on('refreshColumns', this.refreshColumns);

        this.recalcFilteredGoods();
    },

    mounted: function () {
        this.registerFilters();
        $$("goodsRatingTableWebixCtrl").filterByAll();
    },

    methods: {
        searchTextOnChanged: function(data) {
            this.filters.searchText = data;
            this.recalcFilteredGoods();
            $$("goodsRatingTableWebixCtrl").filterByAll();
        },

        favoritesOnlyChanged: function(data) {
            this.filters.favoritesOnly = data;
            this.recalcFilteredGoods();
            $$("goodsRatingTableWebixCtrl").filterByAll();
        },

        recalcFilteredGoods: function () {
            let filtered = {};
            let searchTextLowerCase = this.filters.searchText.toLowerCase();

            for (let i = 0; i < this.data.goods.length; i++) {
                let good = this.data.goods[i];
                var addGood = false;

                if (this.filters.favoritesOnly == true) {
                    if (this.favorites[good.id] == false)
                        continue;
                }

                if (good.title.toLowerCase().indexOf(searchTextLowerCase) >= 0)
                    addGood = true;
                else {
                    if (good.code.toString().indexOf(searchTextLowerCase) >= 0)
                        addGood = true;
                    else {
                        if (good.brand.toLowerCase().indexOf(searchTextLowerCase) >= 0)
                            addGood = true;
                        else {
                            if (good.shop.toLowerCase().indexOf(searchTextLowerCase) >= 0)
                                addGood = true;
                        }
                    }
                }
                if (addGood) filtered[good.id] = true;
            }

            this.filteredGoods = filtered;
        },

        registerFilters: function () {
            let thisVueCompRef = this;
            function compareFn (cellValue, filterValue, obj) {
                if (thisVueCompRef.filteredGoods[obj.id] == true)
                    return true;
                else
                    return false;
            }

            $$("goodsRatingTableWebixCtrl").registerFilter(
                document.getElementById("goods-rating-search-input"),
                {
                    columnId: "any",
                    compare: compareFn
                },
                {
                    getValue: function (view) {
                        return view.value;
                    }
                }
            );

            $$("goodsRatingTableWebixCtrl").registerFilter(
                document.getElementById("goods-rating-favorite-checkbox"),
                {
                    columnId: "any",
                    compare: compareFn
                },
                {
                    getValue: function (view) {
                        return view.value;
                    }
                }
            );
        },

        columnShowChange: function(column) {
            if (column.show == true)
                $$("goodsRatingTableWebixCtrl").showColumn(column.id, {spans: true});
            else
                $$("goodsRatingTableWebixCtrl").hideColumn(column.id, {spans: false});
        },

        refreshColumns: function() {
            $$("goodsRatingTableWebixCtrl").refreshColumns(goodsRatingTableColumns.getColumns());
            this.registerFilters();
            $$("goodsRatingTableWebixCtrl").filterByAll();
        },

        tipsRender: function(obj, common) { // функция нужна т.к. без нее не работают tooltips в конфиге columns -> tooltip template
            return '';
        }
    }
}
