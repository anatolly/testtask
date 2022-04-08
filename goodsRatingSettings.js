import goodsRatingTableColumns from './goodsRatingTableColumns.js';

import eventsBus from "./eventsBus.js";

export default {
    template: `
        <div>
            <div class="goods-rating-settings-window-back" :style="{ visibility: showWindow == true ? 'visible' : 'hidden' }" @click="showWindow = false">  </div>
            <div class="goods-rating-settings-window" :style="{ visibility: showWindow == true ? 'visible' : 'hidden' }">
                <div @click="showWindow = false"><i class="fas fa-times goods-rating-settings-window-close-icon" /></div>
                <div class="goods-rating-settings-column" v-for="(column, key) in columns" :key="key">
                    <input :id="'columnheader' + key" type="checkbox" v-model="column.show" @change="columnShowOnChange(column)" class="goods-rating-settings-column-checkbox"/>
                    <label :for="'columnheader' + key">
                        {{column.settingsHeader != null ? column.settingsHeader : typeof column.header == 'object' ? column.header[0] : column.header}}
                    </label>
                </div>
                <button @click="columnShowReset" class="goods-rating-settings-button goods-rating-settings-columns-reset">Сбросить</button>        
            </div>
            
            <button @click="showGoodsRatingSettingsWindow" class="goods-rating-settings-button">
              <i class="fa fa-cog goods-rating-settings-button-icon"></i>
              Настройка таблицы
            </button>        
        </div>
    `,

    data() {
        return {
            columns: goodsRatingTableColumns.getColumns(),
            showWindow: false
        }
    },

    // created: function() {
    //     this.columns.forEach(column => { column.show = true });
    // },

    methods: {
        showGoodsRatingSettingsWindow: function() {
            this.showWindow = true;
        },

        columnShowReset: function() {
            this.columns.forEach(column => {
                if (column.show == false) {
                    column.show = true;
                    eventsBus.$emit('columnShowChange', column);
                }
            });
            eventsBus.$emit('refreshColumns');
        },

        columnShowOnChange: function (column) {
            eventsBus.$emit('columnShowChange', column);
        }
    }
}
