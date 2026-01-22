import React from 'react';
import { FileBarChart2 } from 'lucide-react';

export default function SampleOutputs() {
    return (
        <section className="py-24 bg-muted/30 border-y">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <div className="max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Sample Outputs</h2>
                    <p className="text-muted-foreground">
                        Developers do not trust promises. They trust screenshots & concrete output.
                    </p>
                </div>

                {/* Placeholder Container */}
                <div className="mt-12 group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-background/50 py-24 hover:bg-background/80 transition-colors">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <FileBarChart2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Screenshots Coming Soon</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2">
                        We are compiling a gallery of real analysis reports to show exactly what you get.
                    </p>
                </div>
            </div>
        </section>
    );
}
