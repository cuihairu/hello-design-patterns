# Integration Patterns Overview

Once applications multiply, process boundaries become the problem: the order system has to know the inventory system's address, a single downstream restart drags the whole call chain down, and two systems evolve their message formats independently. The enterprise application integration (EAI) answer is to organize "how processes send messages to each other" into a vocabulary of replaceable components, taken from Hohpe and Woolf's *Enterprise Integration Patterns* [S10]; the channels, routers, and translators of Spring Integration and Apache Camel are that vocabulary implemented in a framework.

## Criteria for this section

Three things must hold to belong in this section:

1. Has a source: it comes from *Enterprise Integration Patterns* [S10], and the source is on the roster.
2. Has consensus: at least two mainstream frameworks have a standard implementation — Spring Integration and Apache Camel cover every item in this section.
3. Component-level collaboration: each pattern is an independently implementable, replaceable component (channel, router, translator, topic), not a style that constrains the whole system topology. By this test, architectural styles such as layering and pipe-filter do not enter this repository; the handling is in the [difference table](/research/coverage).

## The four pages in this section

- [Message Channel](/integration/message-channel): an abstract pipe between sender and receiver, decoupling time, location, and rate — the foundation of this section.
- [Message Router](/integration/message-router): reads message headers and picks an output channel by rule, so "who should this go to" is lifted out of business code.
- [Message Translator](/integration/message-translator): two systems speak different formats, and the translator becomes a standalone component owning the mapping and the version bridge.
- [Publish-Subscribe](/integration/publish-subscribe): one message is delivered to all subscribers — the same intent as [Observer](/behavioral/observer), re-implemented in the cross-process domain.

## Relation to existing sections

- [Producer-Consumer](/concurrency/producer-consumer): an isomorphic channel in-process; over there it solves thread cooperation, here it solves process cooperation.
- [Observer](/behavioral/observer): an isomorphic publish-subscribe in-process; the synchronous callback becomes an asynchronous message, and the failure model is entirely different.
- [Circuit Breaker](/evolution/circuit-breaker), [Timeout](/evolution/timeout), [Retry](/evolution/retry): the other route for cross-process calls — synchronous RPC plus stability governance. It complements message integration, and the same system often uses both.

## How to read

Start with [Message Channel](/integration/message-channel) and keep the two shapes — point-to-point and publish-subscribe — apart; [Message Router](/integration/message-router) and [Message Translator](/integration/message-translator) are the two kinds of processing components that sit on a channel; read [Publish-Subscribe](/integration/publish-subscribe) against [Observer](/behavioral/observer) and feel which failure model gets swapped when the synchronous callback becomes an asynchronous message.

## Sources

- [S10] The table of contents of EIP's *Enterprise Integration Patterns*.
- [Enterprise Integration Patterns site](https://www.enterpriseintegrationpatterns.com/) (the companion site for [S10]).
- [Wikipedia · Enterprise Integration Patterns](https://en.wikipedia.org/wiki/Enterprise_Integration_Patterns)

<!-- BACKLINKS-AUTO -->
## Related pages

- [glossary](/glossary.md)
- [message-channel](message-channel.md)
- [message-router](message-router.md)
- [message-translator](message-translator.md)
- [publish-subscribe](publish-subscribe.md)
- [introduction](/introduction.md)
- [knowledge](/knowledge.md)
- [reference](/reference.md)
- [books](/research/books.md)
- [coverage](/research/coverage.md)
