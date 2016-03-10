/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./av.d.ts" />

import * as Vue from 'vue'
import {User, Match, UserLocation, Location} from './model'

import * as $ from 'jquery'

// AV.initialize('uihStz52znkhiKH9RYKeBV1C-gzGzoHsz', 'FTU89VelqCLGFve7FYui98Yu');
// var u1 = new User('壮壮', 'https://avatars0.githubusercontent.com/u/521058');  56e13631a341310054d36b13
// var u2 = new User('hildert', 'https://avatars3.githubusercontent.com/u/1715548'); 56e13631816dfa00526b7952
// var u3 = new User('leisun', 'https://avatars1.githubusercontent.com/u/5569844');  56e136317db2a200528e6f15
// var u4 = new User('daniel', 'https://avatars2.githubusercontent.com/u/313230'); 56e13631816dfa0051de6993

// AV.Promise.when(
//     u1.save(),
//     u2.save(),
//     u3.save(),
//     u4.save()
// ).then(function(res){
//     console.log(res);
// }, function(err) {
//     console.error(err);
// });

class App {
    public left_1: User;
    public left_2: User;
    public right_1: User;
    public right_2: User;
    
    public match: Match;
   
    constructor(){
        AV.initialize('uihStz52znkhiKH9RYKeBV1C-gzGzoHsz', 'FTU89VelqCLGFve7FYui98Yu');
    }    
    restart(){  
        this.match = new Match('苏州');        
        this.match.setUser(this.left_1, UserLocation.LEFT_1);
        this.match.setUser(this.left_2, UserLocation.LEFT_2);
        this.match.setUser(this.right_1, UserLocation.RIGHT_1);
        this.match.setUser(this.right_2, UserLocation.RIGHT_2);                
    }
    run(){
        var self = this;
        $.when(
            User.get('56e13631a341310054d36b13'),
            User.get('56e13631816dfa00526b7952'),
            User.get('56e136317db2a200528e6f15'),
            User.get('56e13631816dfa0051de6993')
        ).then(function(u1, u2, u3, u4){
            self.left_1 = u1;
            self.left_2 = u2;
            self.right_1 = u3;
            self.right_2 = u4;            
            self.__run();
            console.log('启动...');
        }, function(err){
            alert('加载用户失败');
            console.error(err);
        });    
    }    
    __run(){
        var self = this;
        this.restart();
        var loc_2_user = {
            [1]: this.left_1,
            [2]: this.left_2,
            [3]: this.right_1,
            [4]: this.right_2,
        }
        new Vue({
            el: '#foosball',
            data: {
                left_goal: 0,
                right_goal: 0,
                left1_user_avatar: self.left_1.avatar_url,                
                left2_user_avatar: self.left_2.avatar_url,
                right1_user_avatar: self.right_1.avatar_url,
                right2_user_avatar: self.right_2.avatar_url,
            },
            methods: {
                __cb_finish(loc: Location){
                    console.log(loc + 'win!!');
                    self.match.save(); // 自动结束 保存
                    
                    this.restart();
                },
                goal(user_loc:number){
                    var user = <User>loc_2_user[user_loc];
                    user.goal(this.__cb_finish);
                    this.__update_state();                   
                },
                own_goal(user_loc:number){
                    var user = <User>loc_2_user[user_loc];
                    user.own_goal(this.__cb_finish);
                    this.__update_state();
                },               
                restart(){
                    self.restart();       
                    this.__update_state();                 
                },
                start(){
                    this.restart();
                },
                end(){
                    self.match.save(); // 自动结束 保存
                    
                    this.restart();
                },
                __update_state(){
                    this.left_goal = self.match.left_goal;
                    this.right_goal = self.match.right_goal;                    
                }
            }
        });
    }
}

export var app = new App();
