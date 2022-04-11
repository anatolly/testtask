import eventsBus from './eventsBus.js';

export default {
    template: `
        <div>
            <input id="goods-rating-favorite-checkbox" type="checkbox" v-model="favoritesOnly" @change="favoritesOnlyOnChanged" class="goods-rating-favorite-checkbox"/>
            <label for="goods-rating-favorite-checkbox" class="goods-rating-favorite-checkbox-label">Только избранное</label>        
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
