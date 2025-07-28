# Smart Zoom Control

A Chrome extension that prevents accidental browser zooming caused by free-rolling mouse wheels and unintentional Ctrl+scroll combinations.

## The Problem

Modern mice with free-rolling wheels can cause frustrating accidental zooming when:

- The wheel continues spinning after you stop scrolling
- You accidentally press Ctrl while scrolling
- You press Ctrl after already starting to scroll

This extension solves these issues with intelligent timing-based logic.

## Features

- **Smart Timing Detection**: Only allows zoom when Ctrl is pressed BEFORE any wheel activity starts
- **Accidental Zoom Prevention**: Blocks zoom attempts when Ctrl is pressed during or after scrolling
- **Smooth Scroll Fallback**: Converts blocked zoom attempts into smooth scrolling
- **Rate Limiting**: Prevents rapid zoom actions that could be disorienting

## Logic Flow

- User presses Ctrl → Wheel activity starts → ✅ Intentional zoom (allowed)
- User scrolls → Presses Ctrl during scroll → ❌ Accidental zoom (blocked, scroll instead)
- User releases Ctrl → Quick press during wheel → ❌ Spam protection (ignored)

## Privacy Policy

This extension does not collect any user data.
