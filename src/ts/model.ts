/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./av.d.ts" />

import * as $ from 'jquery'

export enum MatchState {
    BEFORE_START,
    GAMEING,
    CANCEL,
    FINISH,
}

export enum Location {
    LEFT,
    RIGHT
}

export enum UserLocation {
    LEFT_1,
    LEFT_2,
    RIGHT_1,
    RIGHT_2
}

type FinishCallback = (loc: Location) => void; 

const G_TOTAL_SCORE = 10;

var _User = AV.Object.extend('Footballer');
var _Match = AV.Object.extend('Match');


class UserCurrentState{
    public match: Match = null;
    public _goal: number = 0;
    public _own_goal: number = 0;
    public location: UserLocation = null;
    public log: string = '';    //打得特别帅之类的
    setLog(log:string){
        this.log = log;    
    }    
    reset(){
        this.match = null;
        this._goal = 0;
        this._own_goal = 0;
        this.location = null;
    }
    goal(cb: FinishCallback){
        this._goal++;
        this.match.goal(this.location, cb);
    }
    own_goal(cb: FinishCallback){
        this._own_goal++;
        this.match.own_goal(this.location, cb);
    }    
}

export class User {
    public _refUser: any;
    
    
    public curState = new UserCurrentState();    
    constructor(public name: string,
                public avatar_url:string,
                public ref?)
    {
        this._refUser = ref || _User.new({
            name, 
            avatar_url
        });
        
        this.curState.reset();
    }
    setcurMatch(match: Match, location: UserLocation){
        this.curState.reset();
        this.curState.location = location;
        this.curState.match = match;
    }    
    goal(cb: FinishCallback){
        this.curState.goal(cb)        
    }
    own_goal(cb: FinishCallback){
        this.curState.own_goal(cb);
    }
       
    setLog(log: string){
        this.curState.setLog(log);
    }
        
// 存储操作
    getId(){
        return this._refUser.id;
    }
    
    save(): JQueryPromise<any>{
        return this._refUser.save();   
    }
    
    static get(id: string): JQueryPromise<User>{
        var defer = $.Deferred();
        var query = new AV.Query(_User);
        query.get(id).then(function(_user){
            var name = _user.get('name');
            var avatar_url = _user.get('avatar_url');
            var user = new User(name, avatar_url, _user);
            defer.resolve(user);
        }, function(err){
            defer.reject(err);
        });
        return defer;
    }
}

export class Match {
    public left1: User = null
    public left2: User = null
    public right1: User = null
    public right2: User = null    
    public state = MatchState.BEFORE_START    
        
    public left_goal: number = 0;
    public right_goal: number = 0;
        
    public _refMatch:any;
        
    constructor(public location: string,                 
                public start_time = Date.now(),
                public end_time = Date.now(),
                ref?){
        this._refMatch = ref || _Match.new({
            location,
            start_time,
            end_time,
            left1:{},
            left2:{},
            right1: {},
            right2: {},
        });                                    
        console.log('开始新的比赛!!!!!!!!!!!!!');
    }
    setUser(user: User, location: UserLocation){
        switch(location){
            case UserLocation.LEFT_1:
                this.left1 = user;
                break;
            case UserLocation.LEFT_2:
                this.left2 = user;
                break;
            case UserLocation.RIGHT_1:
               this.right1 = user;
               break;
            case UserLocation.RIGHT_2:
               this.right2 = user;
               break;
            default:
                console.error('Invalidate location');      
        }
        user.setcurMatch(this, location);        
    }   
    goal(location: UserLocation, cb_finish: FinishCallback){
        if(location === UserLocation.LEFT_1 || 
           location === UserLocation.LEFT_2){
               this.left_goal++;
           }
        if(location === UserLocation.RIGHT_1||
           location === UserLocation.RIGHT_2){
               this.right_goal++;
           }
           
        this.check_finish(cb_finish);
    }
    own_goal(location: UserLocation, cb_finish: FinishCallback){
        if(location === UserLocation.LEFT_1 || 
           location === UserLocation.LEFT_2){
               this.right_goal++;
           }
        if(location === UserLocation.RIGHT_1||
           location === UserLocation.RIGHT_2){
               this.left_goal++;
           }
           
        this.check_finish(cb_finish);
    }
    check_finish(cb_finish: FinishCallback):boolean {
        if(this.left_goal === G_TOTAL_SCORE){
            cb_finish(Location.LEFT);
            this.state = MatchState.FINISH;
            return true;
        }
        if(this.right_goal === G_TOTAL_SCORE){
            cb_finish(Location.RIGHT);
            this.state = MatchState.FINISH;
            return true;
        }
        return false;
    }
    
// 存储操作
    _serializeUser(user: User){
        var data = {
            user: user._refUser,
            state: {
                goal: user.curState._goal,
                own_goal: user.curState._own_goal,
                location: user.curState.location,
                log: user.curState.log
            }
        }
        return data; 
    }
    save(){        
        this._refMatch.set('end_time', Date.now());
        this._refMatch.set('left1', this._serializeUser(this.left1));
        this._refMatch.set('left2', this._serializeUser(this.left2));
        this._refMatch.set('right1', this._serializeUser(this.right1));
        this._refMatch.set('right2', this._serializeUser(this.right2));
        this._refMatch.set('state', this.state);
        this._refMatch.set('left_goal', this.left_goal);
        this._refMatch.set('right_goal', this.right_goal);
        return this._refMatch.save();
    }
}
