import goodsRatingSearch from './goodsRatingSearch.js';
import goodsRatingFavorite from './goodsRatingFavorite.js';
import goodsRatingSettings from './goodsRatingSettings.js';
import goodsRatingTable from './goodsRatingTable.js';

new Vue({
    el: "#app",
    components: {
        'goodsRatingSearch': goodsRatingSearch,
        'goodsRatingFavorite': goodsRatingFavorite,
        'goodsRatingSettings': goodsRatingSettings,
        'goodsRatingTable': goodsRatingTable
    },
    template: `
      <div class="app-container">
        <div class="page-title">Товары в категории</div>
        <div class="goods-rating-header-div">
            <goodsRatingSearch class="goods-rating-search-div"/>
            <goodsRatingFavorite class="goods-rating-favorite-div"/>
            <goodsRatingSettings class="goods-rating-settings-div"/>
        </div>
        <goodsRatingTable class="goods-rating-table-div"/>
      </div>  
    `
});