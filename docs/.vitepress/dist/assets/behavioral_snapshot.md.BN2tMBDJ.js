import{G as e,W as t,n,rt as r}from"./chunks/framework.OKfwtFe7.js";var i=JSON.parse(`{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"behavioral/snapshot.md","filePath":"behavioral/snapshot.md","lastUpdated":1790910996000}`),a={name:`behavioral/snapshot.md`};function o(n,i,a,o,s,c){return r(),t(`div`,null,[...i[0]||=[e(`<h3 id="快照模式-snapshot-pattern" tabindex="-1">快照模式（Snapshot Pattern） <a class="header-anchor" href="#快照模式-snapshot-pattern" aria-label="Permalink to “快照模式（Snapshot Pattern）”">​</a></h3><p>快照模式（Snapshot Pattern），也被称为备忘录模式（Memento Pattern），是一种行为设计模式。它的主要目的是在不破坏封装性的前提下，捕获并保存对象的内部状态，以便稍后将对象恢复到之前的状态。</p><h3 id="主要用途" tabindex="-1">主要用途 <a class="header-anchor" href="#主要用途" aria-label="Permalink to “主要用途”">​</a></h3><ol><li><strong>状态恢复</strong>：允许在需要时恢复对象到之前的某个状态。例如，实现撤销/重做功能。</li><li><strong>保存检查点</strong>：在复杂操作中创建检查点，可以在操作失败时回退到检查点状态。</li><li><strong>实现历史记录</strong>：保存对象的历史状态，以便可以随时查看或恢复。</li></ol><h3 id="参与者" tabindex="-1">参与者 <a class="header-anchor" href="#参与者" aria-label="Permalink to “参与者”">​</a></h3><ol><li><strong>Originator</strong>：原发器，负责创建快照，并在需要时从快照中恢复状态。</li><li><strong>Memento</strong>：快照，保存了原发器的内部状态。</li><li><strong>Caretaker</strong>：管理者，负责保存和恢复快照，但不能修改快照的内容。</li></ol><h3 id="优点" tabindex="-1">优点 <a class="header-anchor" href="#优点" aria-label="Permalink to “优点”">​</a></h3><ul><li><strong>封装性</strong>：保存和恢复状态时，不暴露对象的内部实现细节。</li><li><strong>简化操作</strong>：允许简单地保存和恢复对象状态，实现复杂的撤销/重做操作。</li></ul><h3 id="缺点" tabindex="-1">缺点 <a class="header-anchor" href="#缺点" aria-label="Permalink to “缺点”">​</a></h3><ul><li><strong>内存消耗</strong>：如果对象状态很大或需要频繁保存快照，会消耗大量内存。</li><li><strong>实现复杂性</strong>：需要维护快照的创建和恢复逻辑，增加了实现的复杂性。</li></ul><h3 id="具体实现示例" tabindex="-1">具体实现示例 <a class="header-anchor" href="#具体实现示例" aria-label="Permalink to “具体实现示例”">​</a></h3><h4 id="java实现" tabindex="-1">Java实现 <a class="header-anchor" href="#java实现" aria-label="Permalink to “Java实现”">​</a></h4><div class="language-java line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">java</span><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> java.util.ArrayList;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> java.util.List;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// Originator</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> TextEditor</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    private</span><span style="color:#E1E4E8;"> StringBuilder text;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#B392F0;"> TextEditor</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        text </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> StringBuilder</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> write</span><span style="color:#E1E4E8;">(String </span><span style="color:#FFAB70;">words</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        text.</span><span style="color:#B392F0;">append</span><span style="color:#E1E4E8;">(words);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#E1E4E8;"> String </span><span style="color:#B392F0;">read</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> text.</span><span style="color:#B392F0;">toString</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#E1E4E8;"> Snapshot </span><span style="color:#B392F0;">save</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#E1E4E8;">(text.</span><span style="color:#B392F0;">toString</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> restore</span><span style="color:#E1E4E8;">(Snapshot </span><span style="color:#FFAB70;">snapshot</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        text </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> StringBuilder</span><span style="color:#E1E4E8;">(snapshot.</span><span style="color:#B392F0;">getText</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// Memento</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    private</span><span style="color:#F97583;"> final</span><span style="color:#E1E4E8;"> String text;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#E1E4E8;">(String </span><span style="color:#FFAB70;">text</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#79B8FF;">        this</span><span style="color:#E1E4E8;">.text </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> text;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#E1E4E8;"> String </span><span style="color:#B392F0;">getText</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> text;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// Caretaker</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> SnapshotManager</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    private</span><span style="color:#F97583;"> final</span><span style="color:#E1E4E8;"> List&lt;</span><span style="color:#F97583;">Snapshot</span><span style="color:#E1E4E8;">&gt; snapshots </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#E1E4E8;"> ArrayList&lt;&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> saveSnapshot</span><span style="color:#E1E4E8;">(Snapshot </span><span style="color:#FFAB70;">snapshot</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        snapshots.</span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">(snapshot);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#E1E4E8;"> Snapshot </span><span style="color:#B392F0;">getSnapshot</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">int</span><span style="color:#FFAB70;"> index</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> snapshots.</span><span style="color:#B392F0;">get</span><span style="color:#E1E4E8;">(index);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 客户端代码</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#F97583;"> class</span><span style="color:#B392F0;"> SnapshotPatternDemo</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> static</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> main</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">String</span><span style="color:#E1E4E8;">[] </span><span style="color:#FFAB70;">args</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        TextEditor editor </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> TextEditor</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">        SnapshotManager manager </span><span style="color:#F97583;">=</span><span style="color:#F97583;"> new</span><span style="color:#B392F0;"> SnapshotManager</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        editor.</span><span style="color:#B392F0;">write</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Hello, world!&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        manager.</span><span style="color:#B392F0;">saveSnapshot</span><span style="color:#E1E4E8;">(editor.</span><span style="color:#B392F0;">save</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        editor.</span><span style="color:#B392F0;">write</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot; Welcome to the snapshot pattern.&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        manager.</span><span style="color:#B392F0;">saveSnapshot</span><span style="color:#E1E4E8;">(editor.</span><span style="color:#B392F0;">save</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Current text: &quot;</span><span style="color:#F97583;"> +</span><span style="color:#E1E4E8;"> editor.</span><span style="color:#B392F0;">read</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        editor.</span><span style="color:#B392F0;">restore</span><span style="color:#E1E4E8;">(manager.</span><span style="color:#B392F0;">getSnapshot</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">));</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;After restoring: &quot;</span><span style="color:#F97583;"> +</span><span style="color:#E1E4E8;"> editor.</span><span style="color:#B392F0;">read</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br></div></div><h4 id="c-实现" tabindex="-1">C++实现 <a class="header-anchor" href="#c-实现" aria-label="Permalink to “C++实现”">​</a></h4><div class="language-cpp line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">cpp</span><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#F97583;">#include</span><span style="color:#9ECBFF;"> &lt;iostream&gt;</span></span>
<span class="line"><span style="color:#F97583;">#include</span><span style="color:#9ECBFF;"> &lt;vector&gt;</span></span>
<span class="line"><span style="color:#F97583;">#include</span><span style="color:#9ECBFF;"> &lt;string&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// Memento</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">public:</span></span>
<span class="line"><span style="color:#B392F0;">    Snapshot</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">string</span><span style="color:#F97583;">&amp;</span><span style="color:#FFAB70;"> text</span><span style="color:#E1E4E8;">) : </span><span style="color:#B392F0;">text_</span><span style="color:#E1E4E8;">(text) {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">string</span><span style="color:#B392F0;"> getText</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> text_;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">private:</span></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">string</span><span style="color:#E1E4E8;"> text_;</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// Originator</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> TextEditor</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">public:</span></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> write</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">string</span><span style="color:#F97583;">&amp;</span><span style="color:#FFAB70;"> words</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        text_ </span><span style="color:#F97583;">+=</span><span style="color:#E1E4E8;"> words;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">string</span><span style="color:#B392F0;"> read</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> text_;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    Snapshot</span><span style="color:#B392F0;"> save</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#E1E4E8;">(text_);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> restore</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#F97583;">&amp;</span><span style="color:#FFAB70;"> snapshot</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        text_ </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> snapshot.</span><span style="color:#B392F0;">getText</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">private:</span></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">string</span><span style="color:#E1E4E8;"> text_;</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// Caretaker</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> SnapshotManager</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">public:</span></span>
<span class="line"><span style="color:#F97583;">    void</span><span style="color:#B392F0;"> saveSnapshot</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">const</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#F97583;">&amp;</span><span style="color:#FFAB70;"> snapshot</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        snapshots_.</span><span style="color:#B392F0;">push_back</span><span style="color:#E1E4E8;">(snapshot);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    Snapshot</span><span style="color:#B392F0;"> getSnapshot</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">size_t</span><span style="color:#FFAB70;"> index</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> snapshots_[index];</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">private:</span></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::</span><span style="color:#B392F0;">vector</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#B392F0;">Snapshot</span><span style="color:#E1E4E8;">&gt; snapshots_;</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;">// 客户端代码</span></span>
<span class="line"><span style="color:#F97583;">int</span><span style="color:#B392F0;"> main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#B392F0;">    TextEditor</span><span style="color:#E1E4E8;"> editor;</span></span>
<span class="line"><span style="color:#B392F0;">    SnapshotManager</span><span style="color:#E1E4E8;"> manager;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    editor.</span><span style="color:#B392F0;">write</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Hello, world!&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    manager.</span><span style="color:#B392F0;">saveSnapshot</span><span style="color:#E1E4E8;">(editor.</span><span style="color:#B392F0;">save</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    editor.</span><span style="color:#B392F0;">write</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot; Welcome to the snapshot pattern.&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    manager.</span><span style="color:#B392F0;">saveSnapshot</span><span style="color:#E1E4E8;">(editor.</span><span style="color:#B392F0;">save</span><span style="color:#E1E4E8;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::cout </span><span style="color:#F97583;">&lt;&lt;</span><span style="color:#9ECBFF;"> &quot;Current text: &quot;</span><span style="color:#F97583;"> &lt;&lt;</span><span style="color:#E1E4E8;"> editor.</span><span style="color:#B392F0;">read</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">&lt;&lt;</span><span style="color:#B392F0;"> std</span><span style="color:#E1E4E8;">::endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    editor.</span><span style="color:#B392F0;">restore</span><span style="color:#E1E4E8;">(manager.</span><span style="color:#B392F0;">getSnapshot</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">));</span></span>
<span class="line"><span style="color:#B392F0;">    std</span><span style="color:#E1E4E8;">::cout </span><span style="color:#F97583;">&lt;&lt;</span><span style="color:#9ECBFF;"> &quot;After restoring: &quot;</span><span style="color:#F97583;"> &lt;&lt;</span><span style="color:#E1E4E8;"> editor.</span><span style="color:#B392F0;">read</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">&lt;&lt;</span><span style="color:#B392F0;"> std</span><span style="color:#E1E4E8;">::endl;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#79B8FF;"> 0</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br></div></div><h4 id="python实现" tabindex="-1">Python实现 <a class="header-anchor" href="#python实现" aria-label="Permalink to “Python实现”">​</a></h4><div class="language-python line-numbers-mode"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">python</span><pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8;" tabindex="0" dir="ltr"><code><span class="line"><span style="color:#818e99;"># Memento</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> Snapshot</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#79B8FF;"> __init__</span><span style="color:#E1E4E8;">(self, text):</span></span>
<span class="line"><span style="color:#79B8FF;">        self</span><span style="color:#E1E4E8;">._text </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> text</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> get_text</span><span style="color:#E1E4E8;">(self):</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#79B8FF;"> self</span><span style="color:#E1E4E8;">._text</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;"># Originator</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> TextEditor</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#79B8FF;"> __init__</span><span style="color:#E1E4E8;">(self):</span></span>
<span class="line"><span style="color:#79B8FF;">        self</span><span style="color:#E1E4E8;">._text </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> write</span><span style="color:#E1E4E8;">(self, words):</span></span>
<span class="line"><span style="color:#79B8FF;">        self</span><span style="color:#E1E4E8;">._text </span><span style="color:#F97583;">+=</span><span style="color:#E1E4E8;"> words</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> read</span><span style="color:#E1E4E8;">(self):</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#79B8FF;"> self</span><span style="color:#E1E4E8;">._text</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> save</span><span style="color:#E1E4E8;">(self):</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#E1E4E8;"> Snapshot(</span><span style="color:#79B8FF;">self</span><span style="color:#E1E4E8;">._text)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> restore</span><span style="color:#E1E4E8;">(self, snapshot):</span></span>
<span class="line"><span style="color:#79B8FF;">        self</span><span style="color:#E1E4E8;">._text </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> snapshot.get_text()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;"># Caretaker</span></span>
<span class="line"><span style="color:#F97583;">class</span><span style="color:#B392F0;"> SnapshotManager</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#79B8FF;"> __init__</span><span style="color:#E1E4E8;">(self):</span></span>
<span class="line"><span style="color:#79B8FF;">        self</span><span style="color:#E1E4E8;">._snapshots </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> save_snapshot</span><span style="color:#E1E4E8;">(self, snapshot):</span></span>
<span class="line"><span style="color:#79B8FF;">        self</span><span style="color:#E1E4E8;">._snapshots.append(snapshot)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">    def</span><span style="color:#B392F0;"> get_snapshot</span><span style="color:#E1E4E8;">(self, index):</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#79B8FF;"> self</span><span style="color:#E1E4E8;">._snapshots[index]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#818e99;"># 客户端代码</span></span>
<span class="line"><span style="color:#F97583;">if</span><span style="color:#79B8FF;"> __name__</span><span style="color:#F97583;"> ==</span><span style="color:#9ECBFF;"> &quot;__main__&quot;</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    editor </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> TextEditor()</span></span>
<span class="line"><span style="color:#E1E4E8;">    manager </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> SnapshotManager()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    editor.write(</span><span style="color:#9ECBFF;">&quot;Hello, world!&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    manager.save_snapshot(editor.save())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    editor.write(</span><span style="color:#9ECBFF;">&quot; Welcome to the snapshot pattern.&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    manager.save_snapshot(editor.save())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">    print</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Current text:&quot;</span><span style="color:#E1E4E8;">, editor.read())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    editor.restore(manager.get_snapshot(</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">))</span></span>
<span class="line"><span style="color:#79B8FF;">    print</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;After restoring:&quot;</span><span style="color:#E1E4E8;">, editor.read())</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br></div></div><p>这些示例展示了如何使用快照模式捕获和恢复对象状态，从而实现诸如撤销/重做等功能。</p>`,18)]])}var s=n(a,[[`render`,o]]);export{i as __pageData,s as default};