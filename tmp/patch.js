const fs = require('fs');
let html = fs.readFileSync('frontend/id.html', 'utf8');

html = html.replace(/<div class="auth-field">\s*<label>Email Address or Phone Number[\s\S]*?<button class="auth-submit-btn" id="login-btn" onclick="handleLogin\(\)">\s*<i class="ph ph-sign-in"><\/i> Sign In to NexCart\s*<\/button>/, 
`<form onsubmit="event.preventDefault(); handleLogin();">
                    <div class="auth-field">
                        <label>Email Address or Phone Number</label>
                        <i class="ph ph-user-circle auth-icon"></i>
                        <input type="text" id="login-identifier" class="auth-input" placeholder="you@example.com or +911234567890" autocomplete="username">
                    </div>
                    <div class="auth-field">
                        <label>Password</label>
                        <i class="ph ph-lock auth-icon"></i>
                        <input type="password" id="login-password" class="auth-input" placeholder="••••••••" autocomplete="current-password">
                        <button class="auth-eye" onclick="togglePass('login-password',this)" type="button">
                            <i class="ph ph-eye"></i>
                        </button>
                    </div>
                    <div style="text-align:right;margin-bottom:22px;">
                        <a style="color:#a855f7;font-size:0.84rem;cursor:pointer;" onclick="showToast('Password reset link sent! (demo)', '#a855f7')">Forgot password?</a>
                    </div>
                    <button class="auth-submit-btn" id="login-btn" type="submit">
                        <i class="ph ph-sign-in"></i> Sign In to NexCart
                    </button>
                    </form>`);

html = html.replace(/<div class="auth-field">\s*<label>Full Name[\s\S]*?<button class="auth-submit-btn" id="register-btn" onclick="handleRegister\(\)">\s*<i class="ph ph-sparkle"><\/i> Create My Account\s*<\/button>/,
`<form onsubmit="event.preventDefault(); handleRegister();">
                    <div class="auth-field">
                        <label>Full Name</label>
                        <i class="ph ph-user auth-icon"></i>
                        <input type="text" id="reg-name" class="auth-input" placeholder="Jane Doe" autocomplete="name">
                    </div>
                    <div class="auth-field">
                        <label>Email Address</label>
                        <i class="ph ph-envelope auth-icon"></i>
                        <input type="email" id="reg-email" class="auth-input" placeholder="you@example.com" autocomplete="email">
                    </div>
                    <div class="auth-field">
                        <label>Phone Number</label>
                        <i class="ph ph-phone auth-icon"></i>
                        <input type="tel" id="reg-phone" class="auth-input" placeholder="+911234567890" autocomplete="tel">
                    </div>
                    <div class="auth-field">
                        <label>Password</label>
                        <i class="ph ph-lock auth-icon"></i>
                        <input type="password" id="reg-password" class="auth-input" placeholder="Min. 8 characters" oninput="checkStrength(this.value)" autocomplete="new-password">
                        <button class="auth-eye" onclick="togglePass('reg-password',this)" type="button">
                            <i class="ph ph-eye"></i>
                        </button>
                        <div class="strength-bar" id="strength-bar">
                            <div class="strength-seg" id="seg1"></div>
                            <div class="strength-seg" id="seg2"></div>
                            <div class="strength-seg" id="seg3"></div>
                            <div class="strength-seg" id="seg4"></div>
                        </div>
                    </div>
                    <div class="auth-field">
                        <label>Confirm Password</label>
                        <i class="ph ph-lock-key auth-icon"></i>
                        <input type="password" id="reg-confirm-password" class="auth-input" placeholder="Re-enter password" autocomplete="new-password">
                        <button class="auth-eye" onclick="togglePass('reg-confirm-password',this)" type="button">
                            <i class="ph ph-eye"></i>
                        </button>
                    </div>
                    <button class="auth-submit-btn" id="register-btn" type="submit">
                        <i class="ph ph-sparkle"></i> Create My Account
                    </button>
                    </form>`);

html = html.replace(/<!-- ─── PAGE 3: VIRTUAL TRY-ON ─── -->[\s\S]*?<!-- ─── PAGE 4: CART ─── -->/, '<!-- ─── PAGE 4: CART ─── -->');

html = html.replace(/function populateWardrobe\(\)\s*\{[\s\S]*?document\.getElementById\('dress-label'\)\.textContent = wearables\[0\]\.name;\s*\}\s*\}/, '');

fs.writeFileSync('frontend/id.html', html);
console.log('done patching id.html');
