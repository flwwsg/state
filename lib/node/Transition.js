"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var PseudoStateKind_1 = require("./PseudoStateKind");
var PseudoState_1 = require("./PseudoState");
var TransitionKind_1 = require("./TransitionKind");
/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
var Transition = /** @class */ (function () {
    /**
     * Creates an instance of the Transition class.
     * @param source The source vertex of the transition.
     * @param target The optional target vertex of the transition; leave undefined for internal transitions.
     * @param kind The optional kind of the transition: external, internal or local. If left blank, this will be external if a targed vertex is specified otherwise internal.
     * @param type The optional type of the trigger event that will cause this transition to be traversed. If left undefined any object or primative type will be considered.
     * @public
     */
    function Transition(source, target, kind, type, guard) {
        if (target === void 0) { target = undefined; }
        if (kind === void 0) { kind = (target ? TransitionKind_1.TransitionKind.external : TransitionKind_1.TransitionKind.internal); }
        if (type === void 0) { type = undefined; }
        if (guard === void 0) { guard = function () { return true; }; }
        var _this = this;
        /**
         * A user-defined guard condition that must be true for the transition to be traversed.
         * @internal
         */
        this.userGuard = function () { return true; };
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
        this.source = source;
        this.target = target || source;
        this.activation = new kind(this.source, this.target);
        this.typeGuard = type ? function (trigger) { return trigger.constructor === type; } : function () { return true; };
        this.userGuard = guard;
        // add this transition to the set of outgoing transitions of the source vertex.
        source.outgoing.unshift(this);
        util_1.log.info(function () { return "Created " + _this; }, util_1.log.Create);
    }
    /**
     * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
     * @param type The type of event to test for.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.on = function (type) {
        this.typeGuard = function (trigger) { return trigger.constructor === type; };
        return this;
    };
    /**
     * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.when = function (guard) {
        this.userGuard = guard;
        return this;
    };
    /**
     * Specifies the target vertex, thereby making the transition an external transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.to = function (target, kind) {
        var _this = this;
        if (kind === void 0) { kind = TransitionKind_1.TransitionKind.external; }
        this.target = target;
        this.activation = new kind(this.source, this.target);
        util_1.log.info(function () { return "- converted to " + _this; }, util_1.log.Create);
        return this;
    };
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    Transition.prototype["do"] = function (action) {
        this.actions.unshift(action);
        return this;
    };
    /**
     * Tests an event against the type test and guard condition to see if the event might cause this transition to be traversed.
     * @param trigger The triggering event.
     * @returns Returns true if the trigger passes the type test and guard condition.
     * @internal
     */
    Transition.prototype.evaluate = function (trigger) {
        return this.typeGuard(trigger) && this.userGuard(trigger);
    };
    /** Traverse a transition */
    Transition.prototype.traverse = function (instance, deepHistory, trigger) {
        var transition = this;
        var transitions = [transition];
        // gather all transitions to be taversed either side of static conditional branches (junctions)
        while (transition.target instanceof PseudoState_1.PseudoState && transition.target.kind === PseudoStateKind_1.PseudoStateKind.Junction) {
            transitions.unshift(transition = transition.target.getTransition(trigger));
        }
        var _loop_1 = function (i) {
            util_1.log.info(function () { return "Executing " + transitions[i]; }, util_1.log.Transition);
            // leave elements below the common ancestor
            transitions[i].activation.exitSource(instance, deepHistory, trigger);
            // perform the transition behaviour
            for (var j = transitions[i].actions.length; j--;) {
                transitions[i].actions[j](trigger);
            }
            // enter elements below the common ancestor to the target
            transitions[i].activation.enterTarget(instance, deepHistory, trigger);
        };
        // traverse all transitions
        for (var i = transitions.length; i--;) {
            _loop_1(i);
        }
    };
    Transition.prototype.toString = function () {
        return this.activation + " transition from " + this.source + " to " + this.target;
    };
    return Transition;
}());
exports.Transition = Transition;