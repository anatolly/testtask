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
                columns: goodsRatingTableColumns((obj, common, value, column, index) => {
                    return '<i class="' + (this.favorites[obj.id] ? "fa" : "far") + ' fa-heart good-favorite-icon"></i>'
                }),
                onClick:{
                    'good-favorite-icon': (event, cell, target) => {
                        if (this.favorites[this.data.goods[cell.row - 1].id])
                            delete this.favorites[this.data.goods[cell.row - 1].id];
                        else
                            this.favorites[this.data.goods[cell.row - 1].id] = true;
                        localStorage.setItem('favorites', JSON.stringify(this.favorites));
                        this.goodsRatingTableWebixCtrl.render();
                    }
                }
            }
        }
    },

    created: function () {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || {};

        eventsBus.$on('searchTextChanged', this.searchTextOnChanged);
        eventsBus.$on('favoritesOnlyChanged', this.favoritesOnlyChanged);
        eventsBus.$on('columnShowChange', this.columnShowChange);
        eventsBus.$on('refreshColumns', this.refreshColumns);
    },

    mounted: function () {
        this.goodsRatingTableWebixCtrl = $$("goodsRatingTableWebixCtrl");
        this.registerFilters();

        this.goodsRatingTableWebixCtrl.$scope.$el.addEventListener("image-not-exist", e => this.data.getGoodById(e.detail.id).imageNotExist = true);
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
            const compareFn = (cellValue, filterValue, obj) => {
                const searchTextLowerCase = this.filters.searchText.toLowerCase();

                if ((this.filters.favoritesOnly) && (!this.favorites[obj.id]))
                    return false;

                if ((obj.title.toLowerCase().indexOf(searchTextLowerCase) >= 0) ||
                    (obj.code.toString().indexOf(searchTextLowerCase) >= 0) ||
                    (obj.brand.toLowerCase().indexOf(searchTextLowerCase) >= 0) ||
                    (obj.shop.toLowerCase().indexOf(searchTextLowerCase) >= 0))
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
            this.goodsRatingTableWebixCtrl.refreshColumns(this.webixUIConfig.columns);
            this.registerFilters();
            this.goodsRatingTableWebixCtrl.filterByAll(); // делаем фильтрацию после обнуления значений в полях фильтров. иначе список остается отфитрованным по старым значениям
        }
    }
}
