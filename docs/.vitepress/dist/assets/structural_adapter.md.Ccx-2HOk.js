import{G as e,W as t,n,rt as r}from"./chunks/framework.OKfwtFe7.js";var i=JSON.parse(`{"title":"适配器模式","description":"","frontmatter":{},"headers":[],"relativePath":"structural/adapter.md","filePath":"structural/adapter.md","lastUpdated":1790895574000}`),a={name:`structural/adapter.md`};function o(n,i,a,o,s,c){return r(),t(`div`,null,[...i[0]||=[e(`<h1 id="适配器模式" tabindex="-1">适配器模式 <a class="header-anchor" href="#适配器模式" aria-label="Permalink to “适配器模式”">​</a></h1><p>适配器模式（Adapter Pattern）是一种结构型设计模式，它使得原本由于接口不兼容而不能一起工作的类可以协同工作。通过在客户端和现有接口之间插入一个适配器，适配器模式将一个类的接口转换成客户希望的另一个接口，从而使得原本不兼容的接口可以一起工作。</p><h3 id="适配器模式的使用场景" tabindex="-1">适配器模式的使用场景 <a class="header-anchor" href="#适配器模式的使用场景" aria-label="Permalink to “适配器模式的使用场景”">​</a></h3><ul><li>系统需要使用现有的类，而这些类的接口不符合系统的需求。</li><li>想要创建一个可以重复使用的类，该类可以与一些彼此之间没有太大关联的类或不兼容的类协同工作。</li><li>需要将多个类的接口进行整合，提供一个统一的接口。</li></ul><h3 id="适配器模式的结构" tabindex="-1">适配器模式的结构 <a class="header-anchor" href="#适配器模式的结构" aria-label="Permalink to “适配器模式的结构”">​</a></h3><ul><li><strong>Target</strong>：目标接口，客户端需要的接口。</li><li><strong>Adapter</strong>：适配器类，实现了目标接口并与现有的类进行组合。</li><li><strong>Adaptee</strong>：现有的类，需要适配的类。</li><li><strong>Client</strong>：使用目标接口的客户端。</li></ul><h3 id="示例代码" tabindex="-1">示例代码 <a class="header-anchor" href="#示例代码" aria-label="Permalink to “示例代码”">​</a></h3><h4 id="c" tabindex="-1">C++ <a class="header-anchor" href="#c" aria-label="Permalink to “C++”">​</a></h4><div class="language-cpp line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F97583;">#include</span><span style="color:#9ECBFF;"> &lt;iostream&gt;</span></span>
<span class="line"><span style="color:#F97583;">#include</span><span style="color:#9ECBFF;"> &lt;string&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 目标接口</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Target</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">public:</span></span>
<span class="line"><span style="color:#F97583;">    virtual</span><span style="color:#B392F0;"> ~Target</span><span style="color:#E1E4E8;">() {}</span></span>
<span class="line"><span style="color:#F97583;">    virtual</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> request</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">const</span><span style="color:#F97583;"> =</span><span style="color:#79B8FF;"> 0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 需要适配的类</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Adaptee</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">public:</span></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> specificRequest</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">        std</span><span style="color:#E1E4E8;">::cout </span><span style="color:#F97583;">&lt;&lt;</span><span style="color:#9ECBFF;"> &quot;Adaptee&#39;s specific request&quot;</span><span style="color:#F97583;"> &lt;&lt;</span><span style="color:#B392F0;"> std</span><span style="color:#E1E4E8;">::endl;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 适配器类</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Adapter</span><span style="color:#E1E4E8;"> : </span><span style="color:#F97583;">public</span><span style="color:#B392F0;"> Target</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">public:</span></span>
<span class="line"><span style="color:#B392F0;">    Adapter</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">Adaptee</span><span style="color:#F97583;">*</span><span style="color:#FFAB70;"> adaptee</span><span style="color:#E1E4E8;">) : </span><span style="color:#B392F0;">adaptee_</span><span style="color:#E1E4E8;">(adaptee) {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> request</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">const</span><span style="color:#F97583;"> override</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        adaptee_-&gt;</span><span style="color:#B392F0;">specificRequest</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">private:</span></span>
<span class="line"><span style="color:#B392F0;">    Adaptee</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> adaptee_;</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 客户端代码</span></span>
<span class="line"><span style="color:#F97583;">void</span><span style="color:#B392F0;"> clientCode</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> Target</span><span style="color:#F97583;">*</span><span style="color:#FFAB70;"> target</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    target-&gt;</span><span style="color:#B392F0;">request</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">int</span><span style="color:#B392F0;"> main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#B392F0;">    Adaptee</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> adaptee </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> Adaptee</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#B392F0;">    Target</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;"> adapter </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> Adapter</span><span style="color:#E1E4E8;">(adaptee);</span></span>
<span class="line"><span style="color:#B392F0;">    clientCode</span><span style="color:#E1E4E8;">(adapter);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    delete</span><span style="color:#E1E4E8;"> adaptee;</span></span>
<span class="line"><span style="color:#F97583;">    delete</span><span style="color:#E1E4E8;"> adapter;</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#79B8FF;"> 0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br></div></div><h4 id="go" tabindex="-1">Go <a class="header-anchor" href="#go" aria-label="Permalink to “Go”">​</a></h4><div class="language-go line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#B392F0;"> main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#9ECBFF;"> &quot;</span><span style="color:#B392F0;">fmt</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 目标接口</span></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#B392F0;"> Target</span><span style="color:#F97583;"> interface</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">    Request</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 需要适配的类</span></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#B392F0;"> Adaptee</span><span style="color:#F97583;"> struct</span><span style="color:#E1E4E8;">{}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">a </span><span style="color:#F97583;">*</span><span style="color:#B392F0;">Adaptee</span><span style="color:#E1E4E8;">) </span><span style="color:#B392F0;">SpecificRequest</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    fmt.</span><span style="color:#B392F0;">Println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Adaptee&#39;s specific request&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 适配器类</span></span>
<span class="line"><span style="color:#F97583;">type</span><span style="color:#B392F0;"> Adapter</span><span style="color:#F97583;"> struct</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    adaptee </span><span style="color:#F97583;">*</span><span style="color:#B392F0;">Adaptee</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">a </span><span style="color:#F97583;">*</span><span style="color:#B392F0;">Adapter</span><span style="color:#E1E4E8;">) </span><span style="color:#B392F0;">Request</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    a.adaptee.</span><span style="color:#B392F0;">SpecificRequest</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 客户端代码</span></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#B392F0;"> clientCode</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">target</span><span style="color:#B392F0;"> Target</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    target.</span><span style="color:#B392F0;">Request</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#B392F0;"> main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    adaptee </span><span style="color:#F97583;">:=</span><span style="color:#F97583;"> &amp;</span><span style="color:#B392F0;">Adaptee</span><span style="color:#E1E4E8;">{}</span></span>
<span class="line"><span style="color:#E1E4E8;">    adapter </span><span style="color:#F97583;">:=</span><span style="color:#F97583;"> &amp;</span><span style="color:#B392F0;">Adapter</span><span style="color:#E1E4E8;">{adaptee}</span></span>
<span class="line"><span style="color:#B392F0;">    clientCode</span><span style="color:#E1E4E8;">(adapter)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><h4 id="java" tabindex="-1">Java <a class="header-anchor" href="#java" aria-label="Permalink to “Java”">​</a></h4><div class="language-java line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#818e99;">// 目标接口</span></span>
<span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> Target</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> request</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 需要适配的类</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Adaptee</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> specificRequest</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Adaptee&#39;s specific request&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 适配器类</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Adapter</span><span style="color:#F97583;"> implements</span><span style="color:#B392F0;"> Target</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    private</span><span style="color:#E1E4E8;"> Adaptee adaptee;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#B392F0;"> Adapter</span><span style="color:#E1E4E8;">(Adaptee </span><span style="color:#FFAB70;">adaptee</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#79B8FF;">        this</span><span style="color:#E1E4E8;">.adaptee </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> adaptee;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    @</span><span style="color:#F97583;">Override</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> request</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        adaptee.</span><span style="color:#B392F0;">specificRequest</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 客户端代码</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#F97583;"> class</span><span style="color:#B392F0;"> Main</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> static</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> main</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">String</span><span style="color:#E1E4E8;">[] </span><span style="color:#FFAB70;">args</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        Adaptee adaptee </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> Adaptee</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        Target adapter </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> Adapter</span><span style="color:#E1E4E8;">(adaptee);</span></span>
<span class="line"><span style="color:#E1E4E8;">        adapter.</span><span style="color:#B392F0;">request</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br></div></div><p>这些例子展示了如何在 C++、Go 和 Java 中实现适配器模式。每个例子都定义了一个目标接口、需要适配的类和适配器类，并通过客户端代码调用目标接口的方法，适配器将这些调用转发给需要适配的类的方法。</p>`,14)]])}var s=n(a,[[`render`,o]]);export{i as __pageData,s as default};