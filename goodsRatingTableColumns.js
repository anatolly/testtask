export default function (favoriteTemplateFn) {
    return [
        {   id: "favorite", header: "", settingsHeader: "Избранное", width: 35, sort: "text", tooltip: false, show: true, template: favoriteTemplateFn },
        {   id: "lostProfitPercentage", header: ["Упущ %", ""], width: 80, sort: 'int', tooltip: false, show: true},
        {   id: "pos", header: ["Позиция", ""], adjust: true, sort: 'int', tooltip: false, show: true,
            template: function (obj, common, value, column, index) {
                if (obj.posChange !== 0)
                    return obj.pos +
                        (obj.posChange > 0 ?
                            "<span class='highlight highlight-green'>+" + obj.posChange + "</span>" :
                            "<span class='highlight highlight-red'>" + obj.posChange + "</span>")
                else
                    return obj.pos;
            }
        },
        {
            id: "image", header: ["Фото", ""], width: 60, minWidth: 60, maxWidth: 60, show: true,
            template: function(obj, common, value, column, index) {
                if (!obj.imageNotExist)
                    return "<img id='good-image-" + obj.id + "' src='/goodsImages/" + obj.image + "' class='good-image-thumb' \
                                 onerror='this.src=\"/goodsImages/no-image.png\"; \
                                          this.dispatchEvent(new CustomEvent(\"image-not-exist\", {bubbles: true, detail: {id: " + obj.id + "}}));' >"
                else
                    return "<img src='/goodsImages/no-image.png' class='good-image-thumb'>";
            },
            tooltip: function (obj, common, value, column, index) {
                if (!obj.imageNotExist)
                    return "<img src='/goodsImages/" + obj.image + "' class='good-image'/>";
                else
                    return "";
            }
        },
        {   id: "code", header: ["Артикул", { content: "numberFilter" }], width: 90, sort: "int", tooltip: false, show: true },
        {   id: "sales", header: ["График продаж", ""], width: 200, minWidth: 200, maxWidth: 200,  show: true,
            template: webix.Sparklines.getTemplate("bar"),
            tooltip: "Продажи за последние 30 дней" },
        {   id: "title", header: ["Товар", { content: "textFilter" }], fillspace: true, sort: "string", tooltip: false, show: true },
        {   id: "brand", header: ["Бренд", { content: "multiSelectFilter" }], adjust: true, sort: "string", tooltip: false, show: true },
        {   id: "shop", header: ["Продавец", { content: "multiSelectFilter" }], adjust: true, sort: "string", tooltip: false, show: true },
        {   id: "group", header: ["Группа", { content: "richSelectFilter" }], adjust: true, sort: "string", tooltip: false, show: true },
        {   id: "stockQtty", header: ["Остаток", { content: "numberFilter" }], adjust: true, sort: "int", tooltip: false, show: true },
        {   id: "userReviewsNum", header: ["Отзывы", ""], adjust: true, sort: "int", tooltip: false, show: true },
        {   id: "raiting", header: ["Рейтинг", ""], adjust: true, sort: "int", tooltip: false, show: true },
        {   id: "price", header: ["Цена", ""], adjust: true, format: webix.i18n.numberFormat, sort: "int", tooltip: false, show: true }
    ];
}
