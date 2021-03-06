import { TransitionKind, NamedElement, Region, Transition, Visitor } from '.';
import { types } from './types';
/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
export declare abstract class Vertex extends NamedElement {
    readonly parent: Region | undefined;
    /**
     * Creates a new instance of the vertex class.
     * @param name The name of the vertex.
     * @param parent The parent region of this vertex.
     */
    protected constructor(name: string, parent: Region | undefined);
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event; note that this can be derived from the type parameter.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
     */
    on<TTrigger>(type: types.Constructor<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition at this vertex with a guard condition.
     * @param TTrigger The type of the triggering event.
     * @param guard The guard condition to determine if the transition should be traversed.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    when<TTrigger = any>(guard: types.Predicate<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition from this vertex to the target vertex.
     * @param TTrigger The type of the triggering event that the guard will evaluate.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    to<TTrigger = any>(target: Vertex, kind?: TransitionKind): Transition<any>;
    /**
     * Accepts a visitor.
     * @param visitor The visitor to call back.
     */
    abstract accept(visitor: Visitor): void;
}
