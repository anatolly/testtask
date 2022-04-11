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
        return {
            data: data,
            favorites: {},
            filters: {
                searchText: '',
                favoritesOnly: false
            },
            goodsRatingTableWebixCtrl: null,

            webixUIConfig: {
                view: 'datatable',
                id: 'goodsRatingTableWebixCtrl',
                css: "webix_header_border",
                autoConfig: true,
                autoheight: true,
                scrollX: false,
                select: 'row',
                dragColumn: true,
                tooltip: true,
                resizeColumn: { size: 6 },
                columns: goodsRatingTableColumns.getColumns(),
                onClick:{
                    'good-favorite-icon': (event, cell, target) => {
                        this.favorites[this.data.goods[cell.row - 1].id] = !this.favorites[this.data.goods[cell.row - 1].id];
                        localStorage.setItem('favorites', JSON.stringify(this.favorites));
                        this.goodsRatingTableWebixCtrl.render();
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
    },

    mounted: function () {
        this.goodsRatingTableWebixCtrl = $$("goodsRatingTableWebixCtrl");
        this.registerFilters();
    },

    methods: {
        searchTextOnChanged: function(data) {
            this.filters.searchText = data;
            this.goodsRatingTableWebixCtrl.filterByAll();
        },

        favoritesOnlyChanged: function(data) {
            this.filters.favoritesOnly = data;
            this.goodsRatingTableWebixCtrl.filterByAll();
        },

        registerFilters: function () {
            const thisRef = this;
            function compareFn (cellValue, filterValue, obj) {
                const searchTextLowerCase = thisRef.filters.searchText.toLowerCase();

                if ((thisRef.filters.favoritesOnly) && (!thisRef.favorites[obj.id]))
                    return false;

                if (obj.title.toLowerCase().indexOf(searchTextLowerCase) >= 0)
                    return true;
                if (obj.code.toString().indexOf(searchTextLowerCase) >= 0)
                    return true;
                if (obj.brand.toLowerCase().indexOf(searchTextLowerCase) >= 0)
                    return true;
                if (obj.shop.toLowerCase().indexOf(searchTextLowerCase) >= 0)
                    return true;

                return false;
            }
            this.goodsRatingTableWebixCtrl.registerFilter(
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

            this.goodsRatingTableWebixCtrl.registerFilter(
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
            if (column.show)
                this.goodsRatingTableWebixCtrl.showColumn(column.id, {spans: true});
            else
                this.goodsRatingTableWebixCtrl.hideColumn(column.id, {spans: false});
        },

        refreshColumns: function() {
            this.goodsRatingTableWebixCtrl.refreshColumns(goodsRatingTableColumns.getColumns());
            this.registerFilters();
            this.goodsRatingTableWebixCtrl.filterByAll(); // сделать фильтрацию после обнуления значений в фильтрах. иначе список остается отфитрованным по старым значениям
        }
    }
}
