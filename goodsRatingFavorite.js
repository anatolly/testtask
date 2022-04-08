import eventsBus from './eventsBus.js';

export default {
    template: `
        <div>
            <input id="goods-rating-favorite-checkbox" type="checkbox" v-model="favoritesOnly" @change="favoritesOnlyOnChanged" class="goods-rating-favorite-checkbox"/>
            <div class="goods-rating-favorite-checkbox-label">Только избранное</div>        
        </div>
    `,

    data() {
        return {
            favoritesOnly: false
        }
    },

    methods: {
        favoritesOnlyOnChanged: function() {
            eventsBus.$emit('favoritesOnlyChanged', this.favoritesOnly);
        }
    }
}
