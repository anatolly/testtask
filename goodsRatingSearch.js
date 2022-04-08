import eventsBus from './eventsBus.js';

export default {
    template: `
        <div>
            <input id="goods-rating-search-input" placeholder="Поиск" v-model.string="searchText" @input="searchTextOnChanged" class="goods-rating-search-input"/>        
        </div>
    `,

    data() {
        return {
            searchText: ''
        }
    },

    methods: {
        searchTextOnChanged: function() {
            eventsBus.$emit('searchTextChanged', this.searchText);
        }
    }
}
