# 🗑️ ProCard SaaS - ERP Cleanup Delete List

> **WARNING**: This will permanently delete ERP-specific files. Backup if needed!

---

## 📦 BACKEND DELETIONS

### Models (`backend/src/models/appModels/`)
```
✅ Invoice.js
✅ Payment.js
✅ PaymentMode.js
✅ Quote.js
✅ Taxes.js
⚠️ Client.js (KEEP - will refactor)
```

### Controllers (`backend/src/controllers/appControllers/`)
```
✅ invoiceController/       (entire directory)
✅ paymentController/       (entire directory)
✅ paymentModeController/   (entire directory)
✅ quoteController/         (entire directory)
✅ taxesController/         (entire directory)
⚠️ clientController/       (KEEP - will refactor)
```

### PDF Templates (`backend/src/pdf/`)
```
✅ invoice/                 (entire directory)
✅ quote/                   (entire directory)
```

### Routes (Manual Check Required)
```
⚠️ backend/src/routes/appRoutes/  - Remove invoice/quote/payment imports
```

---

## 🎨 FRONTEND DELETIONS

### Pages (`frontend/src/pages/`)
```
✅ Invoice/                 (entire directory - 5 files)
✅ Payment/                 (entire directory - 3 files)
✅ PaymentMode/             (entire directory - 1 file)
✅ Quote/                   (entire directory - 4 files)
✅ Taxes/                   (entire directory - 1 file)
⚠️ Customer/               (KEEP - rename to "MyCards")
```

### Forms (`frontend/src/forms/`)
```
✅ InvoiceForm.jsx
✅ QuoteForm.jsx
✅ PaymentForm.jsx
✅ PaymentModeForm.jsx
✅ TaxesForm.jsx
```

### Modules (`frontend/src/modules/`)
```
✅ InvoiceModule/           (entire directory)
✅ QuoteModule/             (entire directory)
✅ PaymentModule/           (entire directory)
✅ PaymentModeModule/       (entire directory)
✅ TaxesModule/             (entire directory)
```

### Redux (`frontend/src/redux/`)
```
✅ invoice/                 (entire directory)
✅ quote/                   (entire directory)
✅ payment/                 (entire directory)
```

### Navigation (Manual Update Required)
```
⚠️ frontend/src/apps/Navigation/index.jsx
   - Remove: Invoice, Quote, Payment, Taxes menu items
   - Add: My Cards, Analytics, Upgrade Plan
```

---

## 🔧 MANUAL UPDATES AFTER DELETION

### 1. Backend Routes (`backend/src/routes/appRoutes/index.js`)
**Before:**
```javascript
const invoice = require('./invoiceRoutes');
const quote = require('./quoteRoutes');
const payment = require('./paymentRoutes');
```

**After:**
```javascript
const card = require('./cardRoutes');
```

### 2. Frontend Router (`frontend/src/router/AppRouter.jsx`)
**Remove:**
```jsx
<Route path="/invoice" element={<Invoice />} />
<Route path="/quote" element={<Quote />} />
<Route path="/payment" element={<Payment />} />
```

**Add:**
```jsx
<Route path="/cards" element={<CardList />} />
<Route path="/cards/create" element={<CardCreate />} />
<Route path="/cards/:id/edit" element={<CardEdit />} />
<Route path="/v/:slug" element={<PublicCard />} />
```

### 3. Redux Store (`frontend/src/redux/store.js`)
**Remove:**
```javascript
import invoiceReducer from './invoice';
import quoteReducer from './quote';
import paymentReducer from './payment';
```

**Add:**
```javascript
import cardReducer from './card';
```

---

## ⚡ QUICK EXECUTION

### Option 1: Run Automated Script
```powershell
cd c:\Users\Lenovo\.gemini\antigravity\scratch\ProCard-SaaS
.\cleanup-erp.ps1
```

### Option 2: Manual Deletion (PowerShell)
```powershell
# Backend
Remove-Item -Recurse -Force backend\src\models\appModels\Invoice.js
Remove-Item -Recurse -Force backend\src\models\appModels\Payment.js
Remove-Item -Recurse -Force backend\src\models\appModels\PaymentMode.js
Remove-Item -Recurse -Force backend\src\models\appModels\Quote.js
Remove-Item -Recurse -Force backend\src\models\appModels\Taxes.js
Remove-Item -Recurse -Force backend\src\controllers\appControllers\invoiceController
Remove-Item -Recurse -Force backend\src\controllers\appControllers\paymentController
Remove-Item -Recurse -Force backend\src\controllers\appControllers\paymentModeController
Remove-Item -Recurse -Force backend\src\controllers\appControllers\quoteController
Remove-Item -Recurse -Force backend\src\controllers\appControllers\taxesController

# Frontend
Remove-Item -Recurse -Force frontend\src\pages\Invoice
Remove-Item -Recurse -Force frontend\src\pages\Payment
Remove-Item -Recurse -Force frontend\src\pages\PaymentMode
Remove-Item -Recurse -Force frontend\src\pages\Quote
Remove-Item -Recurse -Force frontend\src\pages\Taxes
Remove-Item -Recurse -Force frontend\src\forms\InvoiceForm.jsx
Remove-Item -Recurse -Force frontend\src\forms\QuoteForm.jsx
Remove-Item -Recurse -Force frontend\src\forms\PaymentForm.jsx
Remove-Item -Recurse -Force frontend\src\modules\InvoiceModule
Remove-Item -Recurse -Force frontend\src\modules\QuoteModule
Remove-Item -Recurse -Force frontend\src\modules\PaymentModule
Remove-Item -Recurse -Force frontend\src\redux\invoice
Remove-Item -Recurse -Force frontend\src\redux\quote
Remove-Item -Recurse -Force frontend\src\redux\payment
```

---

## ✅ VERIFICATION CHECKLIST

After deletion, verify:
- [ ] Backend server still starts (`npm run dev`)
- [ ] Frontend still compiles (`npm run dev`)
- [ ] Login/Register pages work
- [ ] Dashboard loads (might be empty - that's OK)
- [ ] No console errors related to missing modules
- [ ] `Card.js` model exists and is properly imported

---

## 🚨 ROLLBACK (If Something Breaks)

```powershell
# Restore from git
git checkout backend/src/models/appModels/
git checkout frontend/src/pages/

# Or restore specific file
git checkout backend/src/models/appModels/Invoice.js
```

---

**Total Items to Delete**: ~45 files/directories  
**Estimated Time**: 5 minutes (automated) | 15 minutes (manual)  
**Disk Space Freed**: ~2-3 MB of code

---

**Status**: Ready to Execute ✅
