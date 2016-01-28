new Vue({
    el: '#pingpong',
    data: {
        left: 0,
        right: 0
    },
    methods: {
        left_inc: function(){
            this.left++;
        },
        right_inc: function(){
            this.right++;
        },
        start: function(){
            this.left = 0;
            this.right = 0;
        },
        end: function(){

        }
    }
});