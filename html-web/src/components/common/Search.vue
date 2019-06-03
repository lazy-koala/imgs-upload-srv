<template>
    
    <el-row type="flex" justify="left">
        <el-col :span="4">
        <el-select v-model="selectedSort" filterable placeholder="请选择分类">
                <el-option
                v-for="item in sortList"
                :key="item.sortId"
                :label="item.sortName"
                :value="item.sortId">
                </el-option>
            </el-select>
        </el-col>
        <div  class="tag-wrapper">
            <el-tag 
                class="tag-item"
                :key="tag"
                v-for="tag in tagList"
                closable
                size=small 
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
            </el-tag>            
            <el-input  
                v-if="tagList.length < 3"              
                v-model="tagValue"
                placeholder="输入标签关键字并回车"
                ref="saveTagInput"
                maxlength=6
                minlength=3
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
            </el-input>
        </div>
        <div>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        </div>
    </el-row>
</template>
<script>
import $axios from 'axios';

export default {
    name: 'search',
    data() {
        return {
            sortList: [],
            selectedSort: '',
            tagList: [], //搜索输入的标签列表
            tagInputVisible: false,
            tagValue: '' //输入标签的值
        }
    },
    methods: {
        // 获取分类列表
        getSortList: function (params) {
            $axios.get('/api/sort/list', {params}).then((res) => {
                if (res.data) {
                    this.sortList =[{sortId: "", sortName: "全部分类"}, ...(res.data && res.data.data && res.data.data.list || [])];
                }
            })
        },
        handleClose(tag) {
            this.tagList.splice(this.tagList.indexOf(tag), 1);
        },

        showTagInput() {
            this.tagInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let tagValue = this.tagValue;
            if (tagValue) {
            this.tagList.push(tagValue);
            }
            this.tagInputVisible = false;
            this.tagValue = '';
        },

        search() {
            let searchVal = {
                sortId: this.selectedSort,
                tag: this.tagList || []
            };
            // console.log(searchVal);
            
            this.$emit('handleSearch', searchVal);
        }
    },
    mounted() {
        this.getSortList({
            sortId: '',
            sortName: ''
        });
        this.$refs.saveTagInput.$refs.input.focus();

    },
    created() {
        // this.$refs.saveTagInput.$refs.input.focus();
    },

}
</script>

<style>
    .tag-item {
        margin-right: 10px;
    }

    .tag-wrapper {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #dcdfe6;
        .el-input__inner {
            border: none;
        }
    }

</style>


