"use client";

import React from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { getItemById } from "@/data/menuItems";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-width horizontal combo card.
 * combo = { id, title, badge, itemIds, price, mrp, imageUrl }
 */
export default function ComboCard({ combo, currency = "₹" }) {
  const { getQuantity, addItem, decrement } = useMenuOrder();

  // Resolve item objects once
  const items = combo.itemIds.map((id) => getItemById(id)).filter(Boolean);

  // Treat the combo as a single cart "item" keyed by combo.id
  const comboCartItem = {
    id: combo.id,
    title: combo.title,
    price: combo.price,
    mrp: combo.mrp,
    imageUrl: combo.imageUrl,
    // description for order history / table session
    description: items.map((i) => i.title).join(", "),
  };

  const quantity = getQuantity(combo.id);
  const saving = combo.mrp - combo.price;

  return (
    <motion.div
      layout
      className="w-full rounded-2xl bg-surface border border-border-light overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
    >
      {/* Left — Image */}
      <div className="relative w-[130px] shrink-0 overflow-hidden bg-surface-soft">
        <img
          src={combo.imageUrl}
          alt={combo.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Badge */}
        <span className="absolute left-0 top-2 rounded-r-lg bg-primary px-2 py-0.5 text-[9px] font-bold text-text-on-primary shadow-sm leading-tight">
          {combo.badge}
        </span>
      </div>

      {/* Right — Content */}
      <div className="flex flex-col flex-1 p-3 gap-1 min-w-0">
        {/* Title + saving pill */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-text-primary leading-snug">
            {combo.title}
          </h3>
          {saving > 0 && (
            <span className="shrink-0 text-[9px] font-bold text-success bg-success-light px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Save {currency}{saving}
            </span>
          )}
        </div>

        {/* Includes label */}
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">
          Includes:
        </p>

        {/* Item chips */}
        <div className="flex flex-wrap gap-1">
          {items.map((item) => (
            <span
              key={item.id}
              className="text-[10px] text-text-secondary bg-surface-soft border border-border-light px-1.5 py-0.5 rounded-md leading-tight"
            >
              {item.title}
            </span>
          ))}
        </div>

        {/* Price row + Add button */}
        <div className="flex items-center justify-between mt-auto pt-1 gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-text-primary">
              {currency}{combo.price}
            </span>
            {combo.mrp && combo.mrp > combo.price && (
              <span className="text-[11px] text-text-muted line-through">
                {currency}{combo.mrp}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {quantity === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => addItem(comboCartItem, 1)}
                className="shrink-0 flex items-center gap-1 rounded-xl border border-primary/30 bg-success-light px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-text-on-primary"
              >
                <ShoppingBag size={12} />
                Add
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="shrink-0 flex items-center gap-1 rounded-xl border border-primary/30 bg-success-light px-1.5 py-1 text-primary"
              >
                <button
                  type="button"
                  onClick={() => decrement(combo.id)}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 active:scale-90 transition-all"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="text-xs font-bold text-text-primary select-none w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => addItem(comboCartItem, 1)}
                  aria-label="Increase quantity"
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 active:scale-90 transition-all"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
