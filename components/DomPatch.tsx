'use client';

import { useEffect } from 'react';

/**
 * Global DOM Patch for Next.js / React 19
 * Prevents "NotFoundError: Failed to execute 'removeChild' on 'Node'"
 * when Google Translate, browser extensions, or 3rd party scripts modify DOM text nodes.
 */
if (typeof window !== 'undefined') {
  if (typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (!child) return child;
      if (child.parentNode !== this) {
        if (child.parentNode) {
          try {
            return child.parentNode.removeChild(child) as T;
          } catch {
            return child;
          }
        }
        return child;
      }
      try {
        return originalRemoveChild.apply(this, arguments as any) as T;
      } catch (err) {
        try {
          if (child.parentNode) {
            return child.parentNode.removeChild(child) as T;
          }
        } catch {
          // ignore
        }
        return child;
      }
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          try {
            return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
          } catch {
            return newNode;
          }
        }
        return newNode;
      }
      try {
        return originalInsertBefore.apply(this, arguments as any) as T;
      } catch {
        return newNode;
      }
    };

    const originalReplaceChild = Node.prototype.replaceChild;
    Node.prototype.replaceChild = function <T extends Node>(newChild: Node, oldChild: T): T {
      if (oldChild && oldChild.parentNode !== this) {
        if (oldChild.parentNode) {
          try {
            return oldChild.parentNode.replaceChild(newChild, oldChild) as T;
          } catch {
            return oldChild;
          }
        }
        return oldChild;
      }
      try {
        return originalReplaceChild.apply(this, arguments as any) as T;
      } catch {
        return oldChild;
      }
    };
  }
}

export const DomPatch = () => {
  useEffect(() => {
    // Ensure document lang is English by default and translate="no" is set
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('translate', 'no');
      document.body?.setAttribute('translate', 'no');
    }
  }, []);

  return null;
};
