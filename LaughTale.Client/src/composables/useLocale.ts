/**
 * LaughTale: useLocale Composable & i18n Engine (Aura Design System compliant)
 * High-performance, zero-overhead client-side internationalization with full Intl formatting,
 * built-in dictionaries (English, Arabic RTL, Spanish, French, German, Turkish, Chinese, Japanese),
 * parameter interpolation, and dynamic locale switching.
 */

import type { IslandContext } from '../runtime/registry';

export interface LocaleDictionary {
    locale: string;
    dir: 'ltr' | 'rtl';
    firstDayOfWeek: number;
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesMin: string[];
    monthNames: string[];
    monthNamesShort: string[];
    today: string;
    clear: string;
    dateFormat: string;
    weekHeader: string;
    weak: string;
    medium: string;
    strong: string;
    passwordPrompt: string;
    emptyFilterMessage: string;
    searchMessage: string;
    selectionMessage: string;
    emptySelectionMessage: string;
    emptySearchMessage: string;
    emptyMessage: string;
    choose: string;
    upload: string;
    cancel: string;
    completed: string;
    pending: string;
    fileSizeTypes: string[];
    startsWith: string;
    contains: string;
    notContains: string;
    endsWith: string;
    equals: string;
    notEquals: string;
    noFilter: string;
    lt: string;
    lte: string;
    gt: string;
    gte: string;
    dateIs: string;
    dateIsNot: string;
    dateBefore: string;
    dateAfter: string;
    apply: string;
    matchAll: string;
    matchAny: string;
    addRule: string;
    removeRule: string;
    accept: string;
    reject: string;
    close: string;
    save: string;
    rowsPerPage: string;
    page: string;
    prevPage: string;
    nextPage: string;
    firstPage: string;
    lastPage: string;
    showingRecordsTemplate: string;
    moveUp: string;
    moveTop: string;
    moveDown: string;
    moveBottom: string;
    moveToTarget: string;
    moveAllToTarget: string;
    moveToSource: string;
    moveAllToSource: string;
    available: string;
    selected: string;
    newChat: string;
    [key: string]: any;
}

const BUILTIN_LOCALES: Record<string, LocaleDictionary> = {
    en: {
        locale: 'en',
        dir: 'ltr',
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
        dateFormat: 'mm/dd/yy',
        weekHeader: 'Wk',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        passwordPrompt: 'Enter a password',
        emptyFilterMessage: 'No results found',
        searchMessage: '{0} results are available',
        selectionMessage: '{0} items selected',
        emptySelectionMessage: 'No selected item',
        emptySearchMessage: 'No results found',
        emptyMessage: 'No available options',
        choose: 'Choose',
        upload: 'Upload',
        cancel: 'Cancel',
        completed: 'Completed',
        pending: 'Pending',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        startsWith: 'Starts with',
        contains: 'Contains',
        notContains: 'Not contains',
        endsWith: 'Ends with',
        equals: 'Equals',
        notEquals: 'Not equals',
        noFilter: 'No Filter',
        lt: 'Less than',
        lte: 'Less than or equal to',
        gt: 'Greater than',
        gte: 'Greater than or equal to',
        dateIs: 'Date is',
        dateIsNot: 'Date is not',
        dateBefore: 'Date is before',
        dateAfter: 'Date is after',
        apply: 'Apply',
        matchAll: 'Match All',
        matchAny: 'Match Any',
        addRule: 'Add Rule',
        removeRule: 'Remove Rule',
        accept: 'Yes',
        reject: 'No',
        close: 'Close',
        save: 'Save',
        rowsPerPage: 'Rows per page',
        page: 'Page {0}',
        prevPage: 'Previous Page',
        nextPage: 'Next Page',
        firstPage: 'First Page',
        lastPage: 'Last Page',
        showingRecordsTemplate: 'Showing {0} to {1} of {2} entries',
        moveUp: 'Move Up',
        moveTop: 'Move Top',
        moveDown: 'Move Down',
        moveBottom: 'Move Bottom',
        moveToTarget: 'Move to Target',
        moveAllToTarget: 'Move All to Target',
        moveToSource: 'Move to Source',
        moveAllToSource: 'Move All to Source',
        available: 'Available',
        selected: 'Selected',
        newChat: 'New chat'
    },
    ku: {
        locale: 'ku',
        dir: 'rtl',
        firstDayOfWeek: 6,
        dayNames: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
        dayNamesShort: ['یەک', 'دوو', 'سێ', 'چوار', 'پێنج', 'هەینی', 'شەم'],
        dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'هـ', 'ش'],
        monthNames: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'],
        monthNamesShort: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'],
        today: 'ئەمڕۆ',
        clear: 'سڕینەوە',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'هـ',
        weak: 'لاواز',
        medium: 'ناوەند',
        strong: 'بەهێز',
        passwordPrompt: 'وشەی نهێنی بنووسە',
        emptyFilterMessage: 'هیچ ئەنجامێک نەدۆزرایەوە',
        searchMessage: '{0} ئەنجام بەردەستە',
        selectionMessage: '{0} بڕگە دیاریکراوە',
        emptySelectionMessage: 'هیچ بڕگەیەک دیارینەکراوە',
        emptySearchMessage: 'هیچ ئەنجامێک نەدۆزرایەوە',
        emptyMessage: 'هیچ بژاردەیەک بەردەست نییە',
        choose: 'هەڵبژاردن',
        upload: 'بارکردن',
        cancel: 'پاشگەزبوونەوە',
        completed: 'تەواوبوو',
        pending: 'چاوەڕوانە',
        fileSizeTypes: ['بایت', 'کیلۆبایت', 'مێگابایت', 'گیگابایت', 'تێرابایت', 'پێتابایت'],
        startsWith: 'دەستپێدەکات بە',
        contains: 'لەخۆدەگرێت',
        notContains: 'لەخۆناگرێت',
        endsWith: 'کۆتایی دێت بە',
        equals: 'یەکسانە بە',
        notEquals: 'یەکسان نییە بە',
        noFilter: 'بێ فلتەر',
        lt: 'کەمترە لە',
        lte: 'کەمتر یان یەکسانە بە',
        gt: 'زیاترە لە',
        gte: 'زیاتر یان یەکسانە بە',
        dateIs: 'بەروار یەکسانە بە',
        dateIsNot: 'بەروار یەکسان نییە بە',
        dateBefore: 'بەروار پێش',
        dateAfter: 'بەروار دوای',
        apply: 'جێبەجێکردن',
        matchAll: 'هاوتای هەمووان',
        matchAny: 'هاوتای هەر یەکێک',
        addRule: 'زیادکردنی مەرج',
        removeRule: 'سڕینەوەی مەرج',
        accept: 'بەڵێ',
        reject: 'نەخێر',
        close: 'داخستن',
        save: 'پاشەکەوتکردن',
        rowsPerPage: 'دێڕ لە پەڕەیەکدا',
        page: 'پەڕەی {0}',
        prevPage: 'پەڕەی پێشوو',
        nextPage: 'پەڕەی داهاتوو',
        firstPage: 'پەڕەی یەکەم',
        lastPage: 'پەڕەی کۆتایی',
        showingRecordsTemplate: 'نیشاندانی {0} تا {1} لە کۆی {2} تۆمار',
        moveUp: 'بەرەو سەرەوە',
        moveTop: 'سەرەوەی سەرەوە',
        moveDown: 'بەرەو خوارەوە',
        moveBottom: 'خوارەوەی خوارەوە',
        moveToTarget: 'گواستنەوە بۆ دیاریکراو',
        moveAllToTarget: 'گواستنەوەی هەمووی بۆ دیاریکراو',
        moveToSource: 'گواستنەوە بۆ سەرچاوە',
        moveAllToSource: 'گواستنەوەی هەمووی بۆ سەرچاوە',
        available: 'بەردەست',
        selected: 'دیاریکراو',
        newChat: 'گفتوگۆی نوێ'
    },
    ckb: {
        locale: 'ckb',
        dir: 'rtl',
        firstDayOfWeek: 6,
        dayNames: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
        dayNamesShort: ['یەک', 'دوو', 'سێ', 'چوار', 'پێنج', 'هەینی', 'شەم'],
        dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'هـ', 'ش'],
        monthNames: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'],
        monthNamesShort: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'],
        today: 'ئەمڕۆ',
        clear: 'سڕینەوە',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'هـ',
        weak: 'لاواز',
        medium: 'ناوەند',
        strong: 'بەهێز',
        passwordPrompt: 'وشەی نهێنی بنووسە',
        emptyFilterMessage: 'هیچ ئەنجامێک نەدۆزرایەوە',
        searchMessage: '{0} ئەنجام بەردەستە',
        selectionMessage: '{0} بڕگە دیاریکراوە',
        emptySelectionMessage: 'هیچ بڕگەیەک دیارینەکراوە',
        emptySearchMessage: 'هیچ ئەنجامێک نەدۆزرایەوە',
        emptyMessage: 'هیچ بژاردەیەک بەردەست نییە',
        choose: 'هەڵبژاردن',
        upload: 'بارکردن',
        cancel: 'پاشگەزبوونەوە',
        completed: 'تەواوبوو',
        pending: 'چاوەڕوانە',
        fileSizeTypes: ['بایت', 'کیلۆبایت', 'مێگابایت', 'گیگابایت', 'تێرابایت', 'پێتابایت'],
        startsWith: 'دەستپێدەکات بە',
        contains: 'لەخۆدەگرێت',
        notContains: 'لەخۆناگرێت',
        endsWith: 'کۆتایی دێت بە',
        equals: 'یەکسانە بە',
        notEquals: 'یەکسان نییە بە',
        noFilter: 'بێ فلتەر',
        lt: 'کەمترە لە',
        lte: 'کەمتر یان یەکسانە بە',
        gt: 'زیاترە لە',
        gte: 'زیاتر یان یەکسانە بە',
        dateIs: 'بەروار یەکسانە بە',
        dateIsNot: 'بەروار یەکسان نییە بە',
        dateBefore: 'بەروار پێش',
        dateAfter: 'بەروار دوای',
        apply: 'جێبەجێکردن',
        matchAll: 'هاوتای هەمووان',
        matchAny: 'هاوتای هەر یەکێک',
        addRule: 'زیادکردنی مەرج',
        removeRule: 'سڕینەوەی مەرج',
        accept: 'بەڵێ',
        reject: 'نەخێر',
        close: 'داخستن',
        save: 'پاشەکەوتکردن',
        rowsPerPage: 'دێڕ لە پەڕەیەکدا',
        page: 'پەڕەی {0}',
        prevPage: 'پەڕەی پێشوو',
        nextPage: 'پەڕەی داهاتوو',
        firstPage: 'پەڕەی یەکەم',
        lastPage: 'پەڕەی کۆتایی',
        showingRecordsTemplate: 'نیشاندانی {0} تا {1} لە کۆی {2} تۆمار',
        moveUp: 'بەرەو سەرەوە',
        moveTop: 'سەرەوەی سەرەوە',
        moveDown: 'بەرەو خوارەوە',
        moveBottom: 'خوارەوەی خوارەوە',
        moveToTarget: 'گواستنەوە بۆ دیاریکراو',
        moveAllToTarget: 'گواستنەوەی هەمووی بۆ دیاریکراو',
        moveToSource: 'گواستنەوە بۆ سەرچاوە',
        moveAllToSource: 'گواستنەوەی هەمووی بۆ سەرچاوە',
        available: 'بەردەست',
        selected: 'دیاریکراو',
        newChat: 'گفتوگۆی نوێ'
    },
    ar: {
        locale: 'ar',
        dir: 'rtl',
        firstDayOfWeek: 6,
        dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        dayNamesShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
        dayNamesMin: ['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'],
        monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        today: 'اليوم',
        clear: 'مسح',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'أسبوع',
        weak: 'ضعيف',
        medium: 'متوسط',
        strong: 'قوي',
        passwordPrompt: 'أدخل كلمة المرور',
        emptyFilterMessage: 'لم يتم العثور على نتائج',
        searchMessage: '{0} نتائج متاحة',
        selectionMessage: 'تم تحديد {0} عناصر',
        emptySelectionMessage: 'لم يتم تحديد أي عنصر',
        emptySearchMessage: 'لم يتم العثور على نتائج',
        emptyMessage: 'لا توجد خيارات متاحة',
        choose: 'اختيار',
        upload: 'رفع',
        cancel: 'إلغاء',
        completed: 'مكتمل',
        pending: 'قيد الانتظار',
        fileSizeTypes: ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت', 'بيتابايت', 'إكسابايت', 'زيتابايت', 'يوتابايت'],
        startsWith: 'يبدأ بـ',
        contains: 'يحتوي على',
        notContains: 'لا يحتوي على',
        endsWith: 'ينتهي بـ',
        equals: 'يساوي',
        notEquals: 'لا يساوي',
        noFilter: 'بدون تصفية',
        lt: 'أقل من',
        lte: 'أقل من أو يساوي',
        gt: 'أكبر من',
        gte: 'أكبر من أو يساوي',
        dateIs: 'التاريخ هو',
        dateIsNot: 'التاريخ ليس',
        dateBefore: 'التاريخ قبل',
        dateAfter: 'التاريخ بعد',
        apply: 'تطبيق',
        matchAll: 'مطابقة الكل',
        matchAny: 'مطابقة أي',
        addRule: 'إضافة شرط',
        removeRule: 'حذف الشرط',
        accept: 'نعم',
        reject: 'لا',
        close: 'إغلاق',
        save: 'حفظ',
        rowsPerPage: 'الصفوف لكل صفحة',
        page: 'صفحة {0}',
        prevPage: 'الصفحة السابقة',
        nextPage: 'الصفحة التالية',
        firstPage: 'الصفحة الأولى',
        lastPage: 'الصفحة الأخيرة',
        showingRecordsTemplate: 'عرض {0} إلى {1} من أصل {2} سجل',
        moveUp: 'تحريك للأعلى',
        moveTop: 'تحريك للبداية',
        moveDown: 'تحريك للأسفل',
        moveBottom: 'تحريك للنهاية',
        moveToTarget: 'نقل إلى المحدد',
        moveAllToTarget: 'نقل الكل إلى المحدد',
        moveToSource: 'نقل إلى المتاح',
        moveAllToSource: 'نقل الكل إلى المتاح',
        available: 'المتاح',
        selected: 'المحدد',
        newChat: 'محادثة جديدة'
    },
    es: {
        locale: 'es',
        dir: 'ltr',
        firstDayOfWeek: 1,
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        clear: 'Limpiar',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Sem',
        weak: 'Débil',
        medium: 'Medio',
        strong: 'Fuerte',
        passwordPrompt: 'Introduzca una contraseña',
        emptyFilterMessage: 'No se encontraron resultados',
        searchMessage: '{0} resultados disponibles',
        selectionMessage: '{0} elementos seleccionados',
        emptySelectionMessage: 'No hay elementos seleccionados',
        emptySearchMessage: 'No se encontraron resultados',
        emptyMessage: 'No hay opciones disponibles',
        choose: 'Seleccionar',
        upload: 'Subir',
        cancel: 'Cancelar',
        completed: 'Completado',
        pending: 'Pendiente',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        startsWith: 'Comienza con',
        contains: 'Contiene',
        notContains: 'No contiene',
        endsWith: 'Termina con',
        equals: 'Igual a',
        notEquals: 'Diferente de',
        noFilter: 'Sin filtro',
        lt: 'Menor que',
        lte: 'Menor o igual que',
        gt: 'Mayor que',
        gte: 'Mayor o igual que',
        dateIs: 'Fecha igual a',
        dateIsNot: 'Fecha diferente de',
        dateBefore: 'Fecha anterior a',
        dateAfter: 'Fecha posterior a',
        apply: 'Aplicar',
        matchAll: 'Coincidir con todos',
        matchAny: 'Coincidir con cualquiera',
        addRule: 'Agregar regla',
        removeRule: 'Eliminar regla',
        accept: 'Sí',
        reject: 'No',
        close: 'Cerrar',
        save: 'Guardar',
        rowsPerPage: 'Filas por página',
        page: 'Página {0}',
        prevPage: 'Página anterior',
        nextPage: 'Página siguiente',
        firstPage: 'Primera página',
        lastPage: 'Última página',
        showingRecordsTemplate: 'Mostrando {0} a {1} de {2} registros',
        moveUp: 'Subir',
        moveTop: 'Mover al inicio',
        moveDown: 'Bajar',
        moveBottom: 'Mover al final',
        moveToTarget: 'Mover a destino',
        moveAllToTarget: 'Mover todos a destino',
        moveToSource: 'Mover a origen',
        moveAllToSource: 'Mover todos a origen',
        available: 'Disponibles',
        selected: 'Seleccionados',
        newChat: 'Nuevo chat'
    },
    fr: {
        locale: 'fr',
        dir: 'ltr',
        firstDayOfWeek: 1,
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        today: "Aujourd'hui",
        clear: 'Effacer',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Sem',
        weak: 'Faible',
        medium: 'Moyen',
        strong: 'Fort',
        passwordPrompt: 'Entrez un mot de passe',
        emptyFilterMessage: 'Aucun résultat trouvé',
        searchMessage: '{0} résultats disponibles',
        selectionMessage: '{0} éléments sélectionnés',
        emptySelectionMessage: 'Aucun élément sélectionné',
        emptySearchMessage: 'Aucun résultat trouvé',
        emptyMessage: 'Aucune option disponible',
        choose: 'Choisir',
        upload: 'Téléverser',
        cancel: 'Annuler',
        completed: 'Terminé',
        pending: 'En attente',
        fileSizeTypes: ['B', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'],
        startsWith: 'Commence par',
        contains: 'Contient',
        notContains: 'Ne contient pas',
        endsWith: 'Se termine par',
        equals: 'Égal à',
        notEquals: 'Différent de',
        noFilter: 'Aucun filtre',
        lt: 'Inférieur à',
        lte: 'Inférieur ou égal à',
        gt: 'Supérieur à',
        gte: 'Supérieur ou égal à',
        dateIs: 'Date égale à',
        dateIsNot: 'Date différente de',
        dateBefore: 'Date antérieure à',
        dateAfter: 'Date postérieure à',
        apply: 'Appliquer',
        matchAll: 'Correspondre à tous',
        matchAny: 'Correspondre à au moins un',
        addRule: 'Ajouter une règle',
        removeRule: 'Supprimer la règle',
        accept: 'Oui',
        reject: 'Non',
        close: 'Fermer',
        save: 'Enregistrer',
        rowsPerPage: 'Lignes par page',
        page: 'Page {0}',
        prevPage: 'Page précédente',
        nextPage: 'Page suivante',
        firstPage: 'Première page',
        lastPage: 'Dernière page',
        showingRecordsTemplate: 'Affichage de {0} à {1} sur {2} entrées',
        moveUp: 'Monter',
        moveTop: 'Placer en haut',
        moveDown: 'Descendre',
        moveBottom: 'Placer en bas',
        moveToTarget: 'Déplacer vers cible',
        moveAllToTarget: 'Tout déplacer vers cible',
        moveToSource: 'Déplacer vers source',
        moveAllToSource: 'Tout déplacer vers source',
        available: 'Disponibles',
        selected: 'Sélectionnés',
        newChat: 'Nouvelle discussion'
    },
    de: {
        locale: 'de',
        dir: 'ltr',
        firstDayOfWeek: 1,
        dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        dayNamesShort: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
        dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        today: 'Heute',
        clear: 'Löschen',
        dateFormat: 'dd.mm.yy',
        weekHeader: 'KW',
        weak: 'Schwach',
        medium: 'Mittel',
        strong: 'Stark',
        passwordPrompt: 'Passwort eingeben',
        emptyFilterMessage: 'Keine Ergebnisse gefunden',
        searchMessage: '{0} Ergebnisse verfügbar',
        selectionMessage: '{0} Einträge ausgewählt',
        emptySelectionMessage: 'Kein Eintrag ausgewählt',
        emptySearchMessage: 'Keine Ergebnisse gefunden',
        emptyMessage: 'Keine Optionen verfügbar',
        choose: 'Auswählen',
        upload: 'Hochladen',
        cancel: 'Abbrechen',
        completed: 'Abgeschlossen',
        pending: 'Ausstehend',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        startsWith: 'Beginnt mit',
        contains: 'Enthält',
        notContains: 'Enthält nicht',
        endsWith: 'Endet mit',
        equals: 'Gleich',
        notEquals: 'Ungleich',
        noFilter: 'Kein Filter',
        lt: 'Kleiner als',
        lte: 'Kleiner oder gleich',
        gt: 'Größer als',
        gte: 'Größer oder gleich',
        dateIs: 'Datum ist',
        dateIsNot: 'Datum ist nicht',
        dateBefore: 'Datum ist vor',
        dateAfter: 'Datum ist nach',
        apply: 'Anwenden',
        matchAll: 'Alle Bedingungen erfüllen',
        matchAny: 'Mindestens eine Bedingung erfüllen',
        addRule: 'Regel hinzufügen',
        removeRule: 'Regel entfernen',
        accept: 'Ja',
        reject: 'Nein',
        close: 'Schließen',
        save: 'Speichern',
        rowsPerPage: 'Zeilen pro Seite',
        page: 'Seite {0}',
        prevPage: 'Vorherige Seite',
        nextPage: 'Nächste Seite',
        firstPage: 'Erste Seite',
        lastPage: 'Letzte Seite',
        showingRecordsTemplate: 'Zeige {0} bis {1} von {2} Einträgen',
        moveUp: 'Nach oben',
        moveTop: 'Ganz nach oben',
        moveDown: 'Nach unten',
        moveBottom: 'Ganz nach unten',
        moveToTarget: 'Zur Auswahl hinzufügen',
        moveAllToTarget: 'Alle zur Auswahl hinzufügen',
        moveToSource: 'Aus Auswahl entfernen',
        moveAllToSource: 'Alle aus Auswahl entfernen',
        available: 'Verfügbar',
        selected: 'Ausgewählt',
        newChat: 'Neuer Chat'
    },
    tr: {
        locale: 'tr',
        dir: 'ltr',
        firstDayOfWeek: 1,
        dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
        monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        today: 'Bugün',
        clear: 'Temizle',
        dateFormat: 'dd.mm.yy',
        weekHeader: 'Hf',
        weak: 'Zayıf',
        medium: 'Orta',
        strong: 'Güçlü',
        passwordPrompt: 'Parola giriniz',
        emptyFilterMessage: 'Sonuç bulunamadı',
        searchMessage: '{0} sonuç bulundu',
        selectionMessage: '{0} öğe seçildi',
        emptySelectionMessage: 'Öğe seçilmedi',
        emptySearchMessage: 'Sonuç bulunamadı',
        emptyMessage: 'Seçenek bulunamadı',
        choose: 'Seç',
        upload: 'Yükle',
        cancel: 'İptal',
        completed: 'Tamamlandı',
        pending: 'Bekliyor',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        startsWith: 'İle başlayan',
        contains: 'İçeren',
        notContains: 'İçermeyen',
        endsWith: 'İle biten',
        equals: 'Eşit',
        notEquals: 'Eşit değil',
        noFilter: 'Filtresiz',
        lt: 'Küçüktür',
        lte: 'Küçük eşittir',
        gt: 'Büyüktür',
        gte: 'Büyük eşittir',
        dateIs: 'Tarih eşit',
        dateIsNot: 'Tarih eşit değil',
        dateBefore: 'Tarihten önce',
        dateAfter: 'Tarihten sonra',
        apply: 'Uygula',
        matchAll: 'Tümünü eşle',
        matchAny: 'Herhangi birini eşle',
        addRule: 'Kural Ekle',
        removeRule: 'Kuralı Sil',
        accept: 'Evet',
        reject: 'Hayır',
        close: 'Kapat',
        save: 'Kaydet',
        rowsPerPage: 'Sayfa başına satır',
        page: 'Sayfa {0}',
        prevPage: 'Önceki Sayfa',
        nextPage: 'Sonraki Sayfa',
        firstPage: 'İlk Sayfa',
        lastPage: 'Son Sayfa',
        showingRecordsTemplate: '{0} ile {1} arası gösteriliyor, toplam {2} kayıt',
        moveUp: 'Yukarı Taşı',
        moveTop: 'En Başa Taşı',
        moveDown: 'Aşağı Taşı',
        moveBottom: 'En Sona Taşı',
        moveToTarget: 'Hedefe Taşı',
        moveAllToTarget: 'Tümünü Hedefe Taşı',
        moveToSource: 'Kaynağa Taşı',
        moveAllToSource: 'Tümünü Kaynağa Taşı',
        available: 'Kullanılabilir',
        selected: 'Seçilen',
        newChat: 'Yeni sohbet'
    },
    zh: {
        locale: 'zh',
        dir: 'ltr',
        firstDayOfWeek: 1,
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        today: '今天',
        clear: '清除',
        dateFormat: 'yy/mm/dd',
        weekHeader: '周',
        weak: '弱',
        medium: '中',
        strong: '强',
        passwordPrompt: '请输入密码',
        emptyFilterMessage: '未找到结果',
        searchMessage: '找到 {0} 条结果',
        selectionMessage: '已选择 {0} 项',
        emptySelectionMessage: '未选择任何项',
        emptySearchMessage: '未找到结果',
        emptyMessage: '无可用选项',
        choose: '选择',
        upload: '上传',
        cancel: '取消',
        completed: '已完成',
        pending: '等待中',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        startsWith: '以...开始',
        contains: '包含',
        notContains: '不包含',
        endsWith: '以...结束',
        equals: '等于',
        notEquals: '不等于',
        noFilter: '无筛选',
        lt: '小于',
        lte: '小于等于',
        gt: '大于',
        gte: '大于等于',
        dateIs: '日期为',
        dateIsNot: '日期不为',
        dateBefore: '日期早于',
        dateAfter: '日期晚于',
        apply: '应用',
        matchAll: '匹配全部',
        matchAny: '匹配任一',
        addRule: '添加规则',
        removeRule: '删除规则',
        accept: '是',
        reject: '否',
        close: '关闭',
        save: '保存',
        rowsPerPage: '每页行数',
        page: '第 {0} 页',
        prevPage: '上一页',
        nextPage: '下一页',
        firstPage: '首页',
        lastPage: '尾页',
        showingRecordsTemplate: '显示第 {0} 至 {1} 项，共 {2} 项',
        moveUp: '上移',
        moveTop: '置顶',
        moveDown: '下移',
        moveBottom: '置底',
        moveToTarget: '移至目标',
        moveAllToTarget: '全部移至目标',
        moveToSource: '移至源',
        moveAllToSource: '全部移至源',
        available: '可用项',
        selected: '已选项',
        newChat: '新对话'
    },
    ja: {
        locale: 'ja',
        dir: 'ltr',
        firstDayOfWeek: 0,
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
        dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        today: '今日',
        clear: 'クリア',
        dateFormat: 'yy/mm/dd',
        weekHeader: '週',
        weak: '弱い',
        medium: '普通',
        strong: '強い',
        passwordPrompt: 'パスワードを入力',
        emptyFilterMessage: '検索結果がありません',
        searchMessage: '{0} 件の結果が見つかりました',
        selectionMessage: '{0} 件選択中',
        emptySelectionMessage: '項目が選択されていません',
        emptySearchMessage: '検索結果がありません',
        emptyMessage: '利用可能なオプションがありません',
        choose: '選択',
        upload: 'アップロード',
        cancel: 'キャンセル',
        completed: '完了',
        pending: '保留中',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        startsWith: 'で始まる',
        contains: 'を含む',
        notContains: 'を含まない',
        endsWith: 'で終わる',
        equals: 'と等しい',
        notEquals: 'と等しくない',
        noFilter: 'フィルターなし',
        lt: 'より小さい',
        lte: '以下',
        gt: 'より大きい',
        gte: '以上',
        dateIs: '日付が等しい',
        dateIsNot: '日付が等しくない',
        dateBefore: 'より前の日付',
        dateAfter: 'より後の日付',
        apply: '適用',
        matchAll: 'すべてに一致',
        matchAny: 'いずれかに一致',
        addRule: '条件を追加',
        removeRule: '条件を削除',
        accept: 'はい',
        reject: 'いいえ',
        close: '閉じる',
        save: '保存',
        rowsPerPage: 'ページあたりの行数',
        page: '{0} ページ',
        prevPage: '前のページ',
        nextPage: '次のページ',
        firstPage: '最初のページ',
        lastPage: '最後のページ',
        showingRecordsTemplate: '{0} ～ {1} 件を表示中（全 {2} 件）',
        moveUp: '上へ移動',
        moveTop: '先頭へ移動',
        moveDown: '下へ移動',
        moveBottom: '末尾へ移動',
        moveToTarget: '選択済みに移動',
        moveAllToTarget: 'すべて選択済みに移動',
        moveToSource: '利用可能に移動',
        moveAllToSource: 'すべて利用可能に移動',
        available: '利用可能',
        selected: '選択済み',
        newChat: '新しいチャット'
    }
};

const customLocales: Record<string, Partial<LocaleDictionary>> = {};

/**
 * Registers custom locale translations or extends existing dictionaries on the client.
 */
export function registerLocale(locale: string, dict: Partial<LocaleDictionary>): void {
    if (!locale) return;
    const normalized = locale.toLowerCase();
    customLocales[normalized] = { ...(customLocales[normalized] || {}), ...dict };
}

/**
 * Retrieves the complete LocaleDictionary for the specified locale code.
 */
export function getLocaleDictionary(locale: string = 'en'): LocaleDictionary {
    const norm = (locale || 'en').toLowerCase().trim();
    let lang = norm.split('-')[0];
    if (norm === 'ckb' || norm.startsWith('ckb-') || norm === 'ku-arab-iq' || norm === 'ku-arab' || norm.startsWith('ku')) {
        lang = 'ku';
    } else if (norm === 'ar-iq' || norm.startsWith('ar')) {
        lang = 'ar';
    }

    const base = BUILTIN_LOCALES[norm] || BUILTIN_LOCALES[lang] || BUILTIN_LOCALES.en;
    const customExact = customLocales[norm];
    const customLang = customLocales[lang];

    return {
        ...base,
        ...(customLang || {}),
        ...(customExact || {})
    };
}

/**
 * Evaluates interpolation parameters in translation strings e.g. "Showing {0} to {1} of {2}".
 */
export function formatString(template: string, ...args: any[]): string {
    if (!template || args.length === 0) return template || '';
    return template.replace(/\{(\d+)\}/g, (match, index) => {
        const i = parseInt(index, 10);
        return args[i] !== undefined ? String(args[i]) : match;
    });
}

const EASTERN_ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toLocaleDigits(val: number | string, locale: string = 'en'): string {
    const s = String(val);
    const norm = (locale || '').toLowerCase();
    if (norm === 'ku' || norm.startsWith('ku') || norm === 'ckb' || norm.startsWith('ckb') || norm === 'ar' || norm.startsWith('ar')) {
        return s.replace(/\d/g, d => EASTERN_ARABIC_DIGITS[parseInt(d, 10)]);
    }
    return s;
}

export interface UseLocaleResult {
    locale: string;
    dir: 'ltr' | 'rtl';
    isRtl: boolean;
    dictionary: LocaleDictionary;
    t: (key: string, ...args: any[]) => string;
    formatDigits: (val: number | string) => string;
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
    formatCurrency: (value: number, currency?: string) => string;
}

/**
 * Primary localization composable for LaughTale Islands.
 */
export function useLocale(ctx?: IslandContext): UseLocaleResult {
    let locale = ctx?.locale;
    if (!locale && typeof document !== 'undefined') {
        const htmlLang = document.documentElement.lang || document.querySelector('html')?.getAttribute('lang');
        const htmlDir = document.documentElement.getAttribute('dir') || document.body?.getAttribute('dir');
        if (htmlLang && htmlLang !== 'en') {
            locale = htmlLang;
        } else if (htmlDir === 'rtl') {
            locale = 'ku';
        } else if (document.cookie && document.cookie.includes('.AspNetCore.Culture=')) {
            const match = document.cookie.match(/c=([a-zA-Z-]+)/);
            if (match) locale = match[1];
        }
    }
    locale = locale || 'en';
    const dict = getLocaleDictionary(locale);
    const dir = ctx?.dir || dict.dir || 'ltr';
    const isRtl = dir === 'rtl';

    function t(key: string, ...args: any[]): string {
        const raw = dict[key] !== undefined ? dict[key] : key;
        if (typeof raw === 'string') {
            return formatString(raw, ...args);
        }
        return raw;
    }

    function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        try {
            return new Intl.DateTimeFormat(locale, options).format(d);
        } catch {
            return d.toLocaleDateString();
        }
    }

    function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
        try {
            return new Intl.NumberFormat(locale, options).format(value);
        } catch {
            return String(value);
        }
    }

    function formatDigits(val: number | string): string {
        return toLocaleDigits(val, locale);
    }

    function formatCurrency(value: number, currency: string = 'USD'): string {
        try {
            return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
        } catch {
            return `${value} ${currency}`;
        }
    }

    return {
        locale,
        dir,
        isRtl,
        dictionary: dict,
        t,
        formatDigits,
        formatDate,
        formatNumber,
        formatCurrency
    };
}
