import SwiftUI
import PhotosUI

struct CameraView: View {
    @State private var selectedImage: UIImage?
    @State private var showImagePicker = false
    @State private var showCamera = false
    @State private var selectedMode: CaptureMode = .single
    @State private var isProcessing = false
    @State private var detectedItems: [DetectedItem] = []
    @State private var showDetectionResults = false

    enum CaptureMode: String, CaseIterable {
        case single = "Single Item"
        case outfit = "Full Outfit"

        var description: String {
            switch self {
            case .single: return "Take a photo of a single clothing item"
            case .outfit: return "Take a full-body photo to detect all items"
            }
        }

        var icon: String {
            switch self {
            case .single: return "tshirt"
            case .outfit: return "person.fill"
            }
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                // Mode Selection
                Picker("Mode", selection: $selectedMode) {
                    ForEach(CaptureMode.allCases, id: \.self) { mode in
                        Label(mode.rawValue, systemImage: mode.icon)
                            .tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                Text(selectedMode.description)
                    .font(.caption)
                    .foregroundColor(.secondary)

                if let image = selectedImage {
                    // Show selected image
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(maxHeight: 350)
                        .cornerRadius(16)
                        .padding(.horizontal)

                    if isProcessing {
                        HStack(spacing: 12) {
                            ProgressView()
                            Text(selectedMode == .outfit ? "Detecting items..." : "Analyzing...")
                                .foregroundColor(.secondary)
                        }
                    } else if !detectedItems.isEmpty {
                        // Show detected items count
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.successGreen)
                            Text("\(detectedItems.count) items detected")
                                .font(.headline)
                        }

                        Button("Review & Save Items") {
                            showDetectionResults = true
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.brandIndigo)
                    } else {
                        HStack(spacing: 16) {
                            Button("Retake") {
                                selectedImage = nil
                                detectedItems = []
                            }
                            .buttonStyle(.bordered)

                            Button(selectedMode == .outfit ? "Detect Items" : "Add to Wardrobe") {
                                processImage()
                            }
                            .buttonStyle(.borderedProminent)
                            .tint(.brandIndigo)
                        }
                    }
                } else {
                    Spacer()

                    // Capture prompt
                    VStack(spacing: 16) {
                        Image(systemName: selectedMode == .outfit ? "person.crop.rectangle" : "camera.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.brandIndigo)

                        Text(selectedMode == .outfit
                            ? "Take a Full-Body Photo"
                            : "Capture Your Clothing")
                            .font(.title2.bold())

                        Text(selectedMode == .outfit
                            ? "Stand in front of a mirror or have someone take your photo. We'll detect all visible clothing and accessories!"
                            : "Take a photo of a single item with a clean background for best results.")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }

                    Spacer()

                    // Capture buttons
                    HStack(spacing: 16) {
                        Button {
                            showCamera = true
                        } label: {
                            Label("Camera", systemImage: "camera")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.brandIndigo)

                        Button {
                            showImagePicker = true
                        } label: {
                            Label("Gallery", systemImage: "photo")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding()
                }
            }
            .navigationTitle("Add Items")
            .sheet(isPresented: $showImagePicker) {
                ImagePicker(image: $selectedImage, sourceType: .photoLibrary)
            }
            .sheet(isPresented: $showCamera) {
                ImagePicker(image: $selectedImage, sourceType: .camera)
            }
            .sheet(isPresented: $showDetectionResults) {
                DetectionResultsView(
                    image: selectedImage!,
                    detectedItems: $detectedItems,
                    onSave: {
                        // Reset after saving
                        selectedImage = nil
                        detectedItems = []
                    }
                )
            }
        }
    }

    private func processImage() {
        guard let image = selectedImage else { return }

        isProcessing = true

        Task {
            if selectedMode == .outfit {
                // Detect multiple items from outfit photo
                detectedItems = await detectItemsFromOutfit(image)
            } else {
                // Single item mode - directly add to wardrobe
                await addSingleItem(image)
            }
            isProcessing = false
        }
    }

    private func detectItemsFromOutfit(_ image: UIImage) async -> [DetectedItem] {
        // Call API to detect items
        // For now, return mock data
        return [
            DetectedItem(
                category: "tops",
                subcategory: "t-shirt",
                suggestedName: "Blue T-Shirt",
                primaryColor: "blue",
                confidence: 0.92,
                isSelected: true
            ),
            DetectedItem(
                category: "bottoms",
                subcategory: "jeans",
                suggestedName: "Denim Jeans",
                primaryColor: "denim",
                confidence: 0.89,
                isSelected: true
            ),
            DetectedItem(
                category: "footwear",
                subcategory: "sneakers",
                suggestedName: "White Sneakers",
                primaryColor: "white",
                confidence: 0.87,
                isSelected: true
            ),
            DetectedItem(
                category: "accessories",
                subcategory: "watch",
                suggestedName: "Silver Watch",
                primaryColor: "silver",
                confidence: 0.78,
                isSelected: true
            ),
        ]
    }

    private func addSingleItem(_ image: UIImage) async {
        // Call API to add single item
        // This would use the existing wardrobe add item flow
    }
}

struct DetectedItem: Identifiable {
    let id = UUID()
    let category: String
    let subcategory: String
    let suggestedName: String
    let primaryColor: String
    let confidence: Double
    var isSelected: Bool
}

struct DetectionResultsView: View {
    let image: UIImage
    @Binding var detectedItems: [DetectedItem]
    let onSave: () -> Void
    @Environment(\.dismiss) var dismiss
    @State private var isSaving = false

    var selectedCount: Int {
        detectedItems.filter { $0.isSelected }.count
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Original image
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(maxHeight: 200)
                        .cornerRadius(12)
                        .padding(.horizontal)

                    Text("We detected \(detectedItems.count) items in your photo")
                        .font(.headline)

                    Text("Select the items you want to add to your wardrobe")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    // Detected items list
                    ForEach($detectedItems) { $item in
                        DetectedItemRow(item: $item)
                    }
                    .padding(.horizontal)

                    // Save button
                    Button {
                        saveSelectedItems()
                    } label: {
                        if isSaving {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Save \(selectedCount) Items to Wardrobe")
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(selectedCount > 0 ? Color.brandIndigo : Color.gray300)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                    .disabled(selectedCount == 0 || isSaving)
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Detected Items")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }

    private func saveSelectedItems() {
        isSaving = true

        Task {
            // Call API to save selected items
            try? await Task.sleep(nanoseconds: 1_500_000_000)

            await MainActor.run {
                isSaving = false
                onSave()
                dismiss()
            }
        }
    }
}

struct DetectedItemRow: View {
    @Binding var item: DetectedItem

    var body: some View {
        HStack(spacing: 12) {
            // Selection toggle
            Button {
                item.isSelected.toggle()
            } label: {
                Image(systemName: item.isSelected ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundColor(item.isSelected ? .brandIndigo : .gray300)
            }

            // Item color indicator
            Circle()
                .fill(ClothingColor.color(for: item.primaryColor))
                .frame(width: 40, height: 40)
                .overlay {
                    Circle()
                        .stroke(Color.gray300, lineWidth: 1)
                }

            // Item info
            VStack(alignment: .leading, spacing: 4) {
                Text(item.suggestedName)
                    .font(.headline)

                HStack {
                    Text(item.category.capitalized)
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Text("•")
                        .foregroundColor(.secondary)

                    Text("\(Int(item.confidence * 100))% confidence")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()
        }
        .padding()
        .background(item.isSelected ? Color.brandIndigo.opacity(0.1) : Color.gray100)
        .cornerRadius(12)
        .animation(.easeInOut(duration: 0.2), value: item.isSelected)
    }
}

#Preview {
    CameraView()
}
