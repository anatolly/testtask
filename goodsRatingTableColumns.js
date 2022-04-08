export default {
    _vueComp: null,

    init: function(vueComp) {
        this._vueComp = vueComp;
    },

    getColumns: function() {
        let thisRef = this;

        function sortByFavorite(a, b){
            a = Number(thisRef._vueComp.favorites[a.id]);
            b = Number(thisRef._vueComp.favorites[b.id]);
            return a > b ? 1 : (a < b ? -1 : 0);
        };

        return [
            {   id: "favorite", header: "", settingsHeader: "Избранное", width: 35, sort: sortByFavorite, show: true,
                template: function (obj, common, value, column, index) {
                    let favoriteIconStyle = "far";
                    if (thisRef._vueComp.favorites[obj.id] == true) favoriteIconStyle = "fa";
                    return '<i class="' + favoriteIconStyle + ' fa-heart good-favorite-icon"></i>';
                } },
            {   id: "lostProfitPersentage", header: ["Упущ %", ""], width: 80, sort: 'int',  show: true},
            {   id: "pos", header: ["Позиция", ""], adjust: true, sort: 'int', show: true,
                template: function (obj, common, value, column, index) {
                    if (obj.posChange !== 0)
                        return obj.pos +
                            (obj.posChange > 0 ?
                                "<span class='highlight highlight-green'>+" + obj.posChange + "</span>" :
                                "<span class='highlight highlight-red'>" + obj.posChange + "</span>" )
                    else
                        return obj.pos;
                } },
            {   id: "image", header: ["Фото", ""], width: 60, minWidth: 60, maxWidth: 60, show: true,
                template: "<img src='/goodsImages/#image#' class='good-image-thumb' />",
                tooltip: "<img src='/goodsImages/#image#' class='good-image' />" },
            {   id: "code", header: ["Артикул", { content: "numberFilter" }], width: 90, sort: "int", show: true },
            {   id: "sales", header: ["График продаж", ""], width: 200, minWidth: 200, maxWidth: 200,  show: true,
                template: webix.Sparklines.getTemplate("bar"),
                tooltip: "Продажи за последние 30 дней" },
            {   id: "title", header: ["Товар", { content: "textFilter" }], fillspace: true, sort: "string", show: true },
            {   id: "brand", header: ["Бренд", { content: "multiSelectFilter" }], adjust: true, sort: "string", show: true },
            {   id: "shop", header: ["Продавец", { content: "multiSelectFilter" }], adjust: true, sort: "string", show: true },
            {   id: "group", header: ["Группа", { content: "richSelectFilter" }], adjust: true, sort: "string", show: true },
            {   id: "stockQtty", header: ["Остаток", { content: "numberFilter" }], adjust: true, sort: "int", show: true },
            {   id: "userReviewsNum", header: ["Отзывы", ""], adjust: true, sort: "int", show: true },
            {   id: "raiting", header: ["Рейтинг", ""], adjust: true, sort: "int", show: true },
            {   id: "price", header: ["Цена", ""], adjust: true, format: webix.i18n.numberFormat, sort: "int", show: true }
        ];
    }
}
